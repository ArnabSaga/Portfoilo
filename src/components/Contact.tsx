'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, motion } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

type InquiryType =
  | 'SaaS Platform'
  | 'Creative Frontend'
  | 'Full-Stack MVP'
  | 'Architecture Review'
  | 'General Inquiry';

type ContactStatus = 'idle' | 'validating' | 'sending' | 'success' | 'error';

interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  phone?: string;
  inquiryType: InquiryType;
  message: string;
  'bot-field'?: string;
}

type ContactField = 'firstName' | 'lastName' | 'email' | 'inquiryType' | 'message';

type ContactErrors = Partial<Record<ContactField, string>>;

const FORM_NAME = 'portfolio-contact';
const PUBLIC_EMAIL = 'arnabdey15091@gmail.com';
const DEFAULT_INQUIRY: InquiryType = 'General Inquiry';
const MESSAGE_LIMIT = 2000;

const inquiryTypes = [
  'SaaS Platform',
  'Creative Frontend',
  'Full-Stack MVP',
  'Architecture Review',
  DEFAULT_INQUIRY,
] as const satisfies readonly InquiryType[];

const statementLines = ['Let’s build', 'something', 'that holds', 'up.'] as const;

function fieldErrorId(field: ContactField) {
  return `contact-${field}-error`;
}

function getNamedControl<T extends HTMLInputElement | HTMLTextAreaElement>(
  form: HTMLFormElement,
  name: string
) {
  return form.elements.namedItem(name) as T | null;
}

function validateForm(form: HTMLFormElement) {
  const errors: ContactErrors = {};
  const firstName = getNamedControl<HTMLInputElement>(form, 'firstName');
  const lastName = getNamedControl<HTMLInputElement>(form, 'lastName');
  const email = getNamedControl<HTMLInputElement>(form, 'email');
  const message = getNamedControl<HTMLTextAreaElement>(form, 'message');
  const formData = new FormData(form);

  if (!firstName?.value.trim()) {
    errors.firstName = 'Enter your first name.';
  }

  if (!lastName?.value.trim()) {
    errors.lastName = 'Enter your last name.';
  }

  if (!email?.value.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!email.validity.valid) {
    errors.email = 'Enter a valid email address.';
  }

  if (!formData.get('inquiryType')) {
    errors.inquiryType = 'Choose an inquiry type.';
  }

  if (!message?.value.trim()) {
    errors.message = 'Tell me what you would like to build.';
  }

  return errors;
}

function FieldError({ field, message }: { field: ContactField; message?: string }) {
  if (!message) return null;

  return (
    <p id={fieldErrorId(field)} className="mt-2 font-inter text-xs font-semibold text-foreground">
      {message}
    </p>
  );
}

export default function Contact() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const submissionLockRef = useRef(false);

  const [formStatus, setFormStatus] = useState<ContactStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<ContactErrors>({});
  const [messageLength, setMessageLength] = useState(0);
  const [submittedEmail, setSubmittedEmail] = useState('');

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    form.noValidate = true;

    return () => {
      form.noValidate = false;
    };
  }, []);

  useEffect(() => {
    if (formStatus !== 'success') return;

    const frame = window.requestAnimationFrame(() => {
      successHeadingRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [formStatus]);

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const revealElements = gsap.utils.toArray<HTMLElement>('.contact-reveal', sectionRef.current);
      const ruleElements = gsap.utils.toArray<HTMLElement>('.contact-rule', sectionRef.current);

      gsap.set(revealElements, {
        opacity: 0,
        y: 18,
        willChange: 'opacity, transform',
      });
      gsap.set(ruleElements, {
        scaleX: 0,
        transformOrigin: 'left center',
        willChange: 'transform',
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
        defaults: {
          ease: motion.ease.interface,
        },
        onComplete: () => {
          gsap.set(revealElements, { clearProps: 'opacity,transform,willChange' });
          gsap.set(ruleElements, { clearProps: 'transform,willChange' });
        },
      });

      timeline
        .to(ruleElements, {
          scaleX: 1,
          duration: motion.duration.interface,
          stagger: motion.stagger.text,
        })
        .to(
          revealElements,
          {
            opacity: 1,
            y: 0,
            duration: motion.duration.reveal,
            stagger: motion.stagger.item,
          },
          0.08
        );
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  const clearFieldError = (field: ContactField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.currentTarget.name as ContactField;
    if (field in fieldErrors) clearFieldError(field);

    if (event.currentTarget.name === 'message') {
      setMessageLength(event.currentTarget.value.length);
    }
  };

  const focusFirstInvalidField = (form: HTMLFormElement, errors: ContactErrors) => {
    const firstInvalid = (
      ['firstName', 'lastName', 'email', 'inquiryType', 'message'] as const
    ).find((field) => errors[field]);

    if (!firstInvalid) return;

    const control = form.elements.namedItem(firstInvalid);
    const target = control instanceof RadioNodeList ? control.item(0) : control;

    if (target instanceof HTMLElement) {
      window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formStatus === 'sending' || submissionLockRef.current) return;

    const form = event.currentTarget;
    setFormStatus('validating');

    const errors = validateForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormStatus('idle');
      focusFirstInvalidField(form, errors);
      return;
    }

    const formData = new FormData(form);
    const request: ContactRequest = {
      firstName: formData.get('firstName')?.toString().trim() ?? '',
      lastName: formData.get('lastName')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      country: formData.get('country')?.toString().trim() || undefined,
      phone: formData.get('phone')?.toString().trim() || undefined,
      inquiryType: formData.get('inquiryType') as InquiryType,
      message: formData.get('message')?.toString().trim() ?? '',
      'bot-field': formData.get('bot-field')?.toString() || undefined,
    };

    formData.set('form-name', FORM_NAME);
    formData.set('firstName', request.firstName);
    formData.set('lastName', request.lastName);
    formData.set('email', request.email);
    formData.set('country', request.country ?? '');
    formData.set('phone', request.phone ?? '');
    formData.set('inquiryType', request.inquiryType);
    formData.set('message', request.message);
    formData.set('bot-field', request['bot-field'] ?? '');

    const body = new URLSearchParams();
    formData.forEach((value, key) => body.append(key, value.toString()));

    submissionLockRef.current = true;
    setFormStatus('sending');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmittedEmail(request.email);
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    } finally {
      submissionLockRef.current = false;
    }
  };

  const handleSendAnother = () => {
    formRef.current?.reset();
    submissionLockRef.current = false;
    setFieldErrors({});
    setMessageLength(0);
    setSubmittedEmail('');
    setFormStatus('idle');

    window.requestAnimationFrame(() => {
      firstNameRef.current?.focus({ preventScroll: true });
    });
  };

  const liveMessage =
    formStatus === 'sending'
      ? 'Sending your message.'
      : formStatus === 'success'
        ? 'Message sent successfully.'
        : formStatus === 'error'
          ? 'Message could not be sent.'
          : '';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-background px-4 py-20 text-foreground sm:px-6 sm:py-24 md:px-8 min-[1025px]:py-28 min-[1280px]:py-32"
    >
      <div className="mx-auto max-w-screen-2xl">
        <header>
          <p className="contact-reveal font-inter text-[0.625rem] font-bold uppercase tracking-[0.3em] text-foreground/48">
            Contact / Open Channel
          </p>
          <div className="contact-rule mt-6 h-px bg-border-custom" />
        </header>

        <div className="grid gap-16 pt-12 sm:pt-16 min-[1025px]:grid-cols-12 min-[1025px]:gap-x-12 min-[1025px]:pt-20 min-[1280px]:gap-x-16">
          <div className="min-[1025px]:col-span-5">
            <h2 className="contact-reveal font-syne text-[clamp(2.2rem,8vw,3.6rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.06em] min-[1025px]:text-[clamp(2.6rem,3.6vw,4.5rem)]">
              {statementLines.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h2>

            <p className="contact-reveal mt-8 max-w-[32ch] font-inter text-base leading-7 text-foreground/64 sm:mt-10 sm:text-lg sm:leading-8">
              A strong product starts with a clear conversation. Tell me what you are building and
              where the system needs to go.
            </p>

            <address className="contact-reveal mt-12 max-w-[30rem] not-italic sm:mt-16 min-[1025px]:mt-24">
              <dl className="divide-y divide-border-custom border-y border-border-custom">
                <div className="grid gap-2 py-5 sm:grid-cols-[8rem_1fr] sm:items-baseline">
                  <dt className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.28em] text-foreground/42">
                    Location
                  </dt>
                  <dd className="font-inter text-base font-medium text-foreground/78">
                    Khulna, Bangladesh
                  </dd>
                </div>
                <div className="grid gap-2 py-5 sm:grid-cols-[8rem_1fr] sm:items-baseline">
                  <dt className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.28em] text-foreground/42">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${PUBLIC_EMAIL}`}
                      className="break-all font-inter text-base font-medium text-foreground/78 underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                    >
                      {PUBLIC_EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="grid gap-4 py-5 sm:grid-cols-[8rem_1fr] sm:items-baseline">
                  <dt className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.28em] text-foreground/42">
                    Social
                  </dt>
                  <dd className="flex flex-wrap gap-x-8 gap-y-4">
                    <a
                      href="https://www.linkedin.com/in/achyuta1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center gap-3 font-inter text-xs font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                    >
                      LinkedIn
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </a>
                    <a
                      href="https://github.com/ArnabSaga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center gap-3 font-inter text-xs font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                    >
                      GitHub
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </a>
                  </dd>
                </div>
              </dl>
            </address>
          </div>

          <div className="min-[1025px]:col-span-6 min-[1025px]:col-start-7">
            <div className="contact-reveal flex items-end justify-between gap-6">
              <h3 className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.28em] text-foreground/48">
                Message / 01
              </h3>
              <p className="font-inter text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                Required fields marked *
              </p>
            </div>
            <div className="contact-rule mt-5 h-px bg-foreground" />

            <div
              className={formStatus === 'success' ? 'hidden' : 'block'}
              aria-hidden={formStatus === 'success'}
            >
              <form
                ref={formRef}
                name={FORM_NAME}
                method="POST"
                action="/"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                className="contact-reveal"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value={FORM_NAME} />
                <p className="sr-only">
                  <label htmlFor="contact-bot-field">Do not fill this out if you are human</label>
                  <input id="contact-bot-field" name="bot-field" tabIndex={-1} autoComplete="off" />
                </p>

                <div className="grid gap-x-8 sm:grid-cols-2">
                  <div className="border-b border-border-custom py-7 focus-within:border-foreground">
                    <label
                      htmlFor="contact-first-name"
                      className="block font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/48"
                    >
                      First Name / 01 *
                    </label>
                    <input
                      ref={firstNameRef}
                      id="contact-first-name"
                      name="firstName"
                      required
                      maxLength={80}
                      autoComplete="given-name"
                      placeholder="Achyuta"
                      aria-invalid={Boolean(fieldErrors.firstName)}
                      aria-describedby={
                        fieldErrors.firstName ? fieldErrorId('firstName') : undefined
                      }
                      onChange={handleFieldChange}
                      className="mt-4 min-h-11 w-full bg-transparent font-syne text-xl font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-foreground/28 sm:text-2xl"
                    />
                    <FieldError field="firstName" message={fieldErrors.firstName} />
                  </div>

                  <div className="border-b border-border-custom py-7 focus-within:border-foreground">
                    <label
                      htmlFor="contact-last-name"
                      className="block font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/48"
                    >
                      Last Name / 02 *
                    </label>
                    <input
                      id="contact-last-name"
                      name="lastName"
                      required
                      maxLength={80}
                      autoComplete="family-name"
                      placeholder="Dey"
                      aria-invalid={Boolean(fieldErrors.lastName)}
                      aria-describedby={fieldErrors.lastName ? fieldErrorId('lastName') : undefined}
                      onChange={handleFieldChange}
                      className="mt-4 min-h-11 w-full bg-transparent font-syne text-xl font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-foreground/28 sm:text-2xl"
                    />
                    <FieldError field="lastName" message={fieldErrors.lastName} />
                  </div>
                </div>

                <div className="border-b border-border-custom py-7 focus-within:border-foreground">
                  <label
                    htmlFor="contact-email"
                    className="block font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/48"
                  >
                    Email / 03 *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? fieldErrorId('email') : undefined}
                    onChange={handleFieldChange}
                    className="mt-4 min-h-11 w-full bg-transparent font-syne text-xl font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-foreground/28 sm:text-2xl"
                  />
                  <FieldError field="email" message={fieldErrors.email} />
                </div>

                <div className="grid gap-x-8 sm:grid-cols-2">
                  <div className="border-b border-border-custom py-7 focus-within:border-foreground">
                    <label
                      htmlFor="contact-country"
                      className="block font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/48"
                    >
                      Country / Optional
                    </label>
                    <input
                      id="contact-country"
                      name="country"
                      maxLength={80}
                      autoComplete="country-name"
                      placeholder="Bangladesh"
                      className="mt-4 min-h-11 w-full bg-transparent font-syne text-xl font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-foreground/28 sm:text-2xl"
                    />
                  </div>

                  <div className="border-b border-border-custom py-7 focus-within:border-foreground">
                    <label
                      htmlFor="contact-phone"
                      className="block font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/48"
                    >
                      Phone / Optional
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      maxLength={30}
                      autoComplete="tel"
                      placeholder="+880"
                      className="mt-4 min-h-11 w-full bg-transparent font-syne text-xl font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-foreground/28 sm:text-2xl"
                    />
                  </div>
                </div>

                <fieldset
                  className="border-b border-border-custom py-8"
                  aria-invalid={Boolean(fieldErrors.inquiryType)}
                  aria-describedby={
                    fieldErrors.inquiryType ? fieldErrorId('inquiryType') : undefined
                  }
                >
                  <legend className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/48">
                    Type / Inquiry *
                  </legend>
                  <div className="mt-5 grid gap-x-8 sm:grid-cols-2">
                    {inquiryTypes.map((type, index) => (
                      <label
                        key={type}
                        className="group grid min-h-12 cursor-pointer grid-cols-[auto_auto_1fr] items-center gap-3 border-b border-border-custom py-3 font-inter text-sm text-foreground/58 transition-colors duration-300 has-[:checked]:border-foreground has-[:checked]:text-foreground"
                      >
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type}
                          required
                          defaultChecked={type === DEFAULT_INQUIRY}
                          onChange={handleFieldChange}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="flex h-4 w-4 items-center justify-center rounded-full border border-foreground/32 transition-colors duration-300 after:h-1.5 after:w-1.5 after:rounded-full after:bg-foreground after:opacity-0 peer-checked:border-foreground peer-checked:after:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-foreground"
                        />
                        <span
                          aria-hidden="true"
                          className="text-[0.625rem] font-bold tabular-nums tracking-[0.18em] text-foreground/34 group-has-[:checked]:text-foreground/70"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError field="inquiryType" message={fieldErrors.inquiryType} />
                </fieldset>

                <div className="border-b border-border-custom py-8 focus-within:border-foreground">
                  <div className="flex items-baseline justify-between gap-6">
                    <label
                      htmlFor="contact-message"
                      className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/48"
                    >
                      Message / 07 *
                    </label>
                    <span className="font-inter text-[0.625rem] font-semibold tabular-nums tracking-[0.18em] text-foreground/42">
                      {messageLength} / {MESSAGE_LIMIT}
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={MESSAGE_LIMIT}
                    rows={7}
                    placeholder="Tell me what you’re building..."
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? fieldErrorId('message') : undefined}
                    onChange={handleFieldChange}
                    className="mt-5 w-full resize-y bg-transparent font-inter text-base leading-7 text-foreground outline-none placeholder:text-foreground/28"
                  />
                  <FieldError field="message" message={fieldErrors.message} />
                </div>

                {formStatus === 'error' && (
                  <div className="border-b border-foreground py-6">
                    <p className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.24em] text-foreground/54">
                      Message / Not Sent
                    </p>
                    <p className="mt-3 max-w-[48ch] font-inter text-sm leading-6 text-foreground/66">
                      Something interrupted the submission. Your message is still here. Try again,
                      or email directly at{' '}
                      <a
                        className="font-semibold text-foreground underline underline-offset-4"
                        href={`mailto:${PUBLIC_EMAIL}`}
                      >
                        {PUBLIC_EMAIL}
                      </a>
                      .
                    </p>
                  </div>
                )}

                <p className="py-6 font-inter text-xs leading-5 text-foreground/46">
                  Your details are submitted only so I can respond to your inquiry.
                </p>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="group flex min-h-16 w-full items-center justify-between bg-foreground px-6 font-inter text-xs font-bold uppercase tracking-[0.22em] text-inverse transition-colors duration-300 hover:bg-foreground/88 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-55 sm:px-8"
                >
                  <span>
                    {formStatus === 'sending'
                      ? 'Transmitting...'
                      : formStatus === 'error'
                        ? 'Try Again'
                        : 'Send Message'}
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    {formStatus === 'error' ? '↗' : '→'}
                  </span>
                </button>
              </form>
            </div>

            {formStatus === 'success' && (
              <div className="contact-reveal py-10 sm:py-14">
                <p className="font-inter text-[0.625rem] font-bold uppercase tracking-[0.28em] text-foreground/48">
                  Message / Received
                </p>
                <h3
                  ref={successHeadingRef}
                  tabIndex={-1}
                  className="mt-8 max-w-[9ch] font-syne text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.055em] outline-none"
                >
                  Your message is on its way.
                </h3>
                <p className="mt-8 max-w-[42ch] font-inter text-base leading-7 text-foreground/64">
                  Thanks for reaching out. I will reply using:
                </p>
                <p className="mt-2 break-all font-inter text-base font-semibold text-foreground">
                  {submittedEmail}
                </p>
                <button
                  type="button"
                  onClick={handleSendAnother}
                  className="group mt-10 flex min-h-14 w-full items-center justify-between border-y border-foreground py-4 font-inter text-xs font-bold uppercase tracking-[0.22em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                >
                  <span>Send Another Message</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </div>
            )}

            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {liveMessage}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
