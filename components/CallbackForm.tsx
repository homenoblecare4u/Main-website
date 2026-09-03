'use client';

import { useState, useRef, FormEvent, RefObject } from 'react';
import { submitCallbackEnquiry } from '@/lib/api/callback';
import { clearAttribution } from '@/lib/utm';

interface FormValues {
  name: string;
  phone: string;
  service: string;
  city: string;
  message: string;
  website: string;
}

interface FormErrors {
  name: boolean;
  phone: boolean;
  service: boolean;
  city: boolean;
}

const rules = {
  name: (v: string) => /^[\p{L}][\p{L}\p{M} .'-]{1,59}$/u.test(v.trim()),
  phone: (v: string) => /^[6-9]\d{9}$/.test(v.trim()),
  service: (v: string) => v.trim() !== '',
  city: (v: string) => /^[\p{L}][\p{L}\p{M} .'-]{1,49}$/u.test(v.trim()),
};

export default function CallbackForm() {
  const [values, setValues] = useState<FormValues>({
    name: '',
    phone: '',
    service: '',
    city: '',
    message: '',
    website: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    phone: false,
    service: false,
    city: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const fieldRefs: Record<string, RefObject<HTMLInputElement | HTMLSelectElement | null>> = {
    name: nameRef,
    phone: phoneRef,
    service: serviceRef,
    city: cityRef,
  };

  const validateField = (field: keyof FormErrors, val: string): boolean => {
    const isValid = rules[field](val);
    setErrors((prev) => ({ ...prev, [field]: !isValid }));
    return isValid;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setIsSuccess(false);
    setSuccessMessage(null);
    setServerError(null);

    if (field in rules) {
      const key = field as keyof FormErrors;
      if (touched[key] || errors[key]) {
        validateField(key, value);
      }
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSuccess(false);
    setSuccessMessage(null);
    setServerError(null);

    // Honeypot check - reject silently if filled
    if (values.website.trim() !== '') {
      return;
    }

    // Trim values
    const trimmedValues = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      service: values.service.trim(),
      city: values.city.trim(),
      message: values.message.trim(),
      website: values.website,
    };
    setValues(trimmedValues);

    const keys: (keyof FormErrors)[] = ['name', 'phone', 'service', 'city'];
    let firstInvalidRef: RefObject<HTMLInputElement | HTMLSelectElement | null> | null = null;
    let hasError = false;

    const newErrors: FormErrors = { name: false, phone: false, service: false, city: false };

    for (const key of keys) {
      const valid = rules[key](trimmedValues[key]);
      if (!valid) {
        newErrors[key] = true;
        hasError = true;
        if (!firstInvalidRef) {
          firstInvalidRef = fieldRefs[key];
        }
      }
    }

    setErrors(newErrors);

    if (hasError) {
      if (firstInvalidRef && firstInvalidRef.current) {
        firstInvalidRef.current.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCallbackEnquiry(trimmedValues);

      if (result.ok) {
        setIsSuccess(true);
        setSuccessMessage(result.message);
        setServerError(null);

        // Clear stored attribution only upon verified API success
        clearAttribution();

        // Reset form values only on verified success
        setValues({
          name: '',
          phone: '',
          service: '',
          city: '',
          message: '',
          website: '',
        });
        setTouched({});
        setErrors({ name: false, phone: false, service: false, city: false });

        setTimeout(() => {
          if (successRef.current) {
            successRef.current.focus();
          }
        }, 50);
      } else {
        // Preserve entered user values and attribution on failure
        setIsSuccess(false);
        setSuccessMessage(null);
        setServerError(result.message);

        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.focus();
          }
        }, 50);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap contact-shell reveal visible">
        <div className="contact-copy">
          <p className="eyebrow">Start a conversation</p>
          <h2>Let’s find the right care for your family.</h2>
          <p>
            Tell us a little about what you need. In the real website, a care coordinator would contact you to discuss
            the next step.
          </p>
          <p className="mini-note">
            <strong>Prototype note:</strong> Business phone, email, service locations and operating hours are awaiting
            client confirmation.
          </p>
        </div>
        <div className="form-wrap">
          <span className="demo-badge">UI DEMO ONLY — NO DATA IS SENT</span>
          <form id="careForm" noValidate onSubmit={handleSubmit}>
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>
            <div className="fields">
              <div className="field">
                <label htmlFor="name">
                  Full name <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={60}
                  required
                  aria-invalid={errors.name}
                  aria-describedby="nameError"
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                />
                <p className={`error ${errors.name ? 'show' : ''}`} id="nameError" role="alert">
                  Enter your name using 2–60 letters.
                </p>
              </div>

              <div className="field">
                <label htmlFor="phone">
                  Phone number <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  ref={phoneRef}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  minLength={10}
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  placeholder="10-digit mobile number"
                  required
                  aria-invalid={errors.phone}
                  aria-describedby="phoneError"
                  value={values.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                />
                <p className={`error ${errors.phone ? 'show' : ''}`} id="phoneError" role="alert">
                  Enter a valid 10-digit Indian mobile number beginning with 6–9.
                </p>
              </div>

              <div className="field">
                <label htmlFor="service">
                  Care needed <span className="required" aria-hidden="true">*</span>
                </label>
                <select
                  ref={serviceRef}
                  id="service"
                  name="service"
                  required
                  aria-invalid={errors.service}
                  aria-describedby="serviceError"
                  value={values.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  onBlur={() => handleBlur('service')}
                >
                  <option value="">Select a service</option>
                  <option value="Elder Care">Elder Care</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Physiotherapy">Physiotherapy</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
                <p className={`error ${errors.service ? 'show' : ''}`} id="serviceError" role="alert">
                  Select the care you need.
                </p>
              </div>

              <div className="field">
                <label htmlFor="city">
                  City <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  ref={cityRef}
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  minLength={2}
                  maxLength={50}
                  required
                  aria-invalid={errors.city}
                  aria-describedby="cityError"
                  value={values.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                />
                <p className={`error ${errors.city ? 'show' : ''}`} id="cityError" role="alert">
                  Enter a valid city using 2–50 letters.
                </p>
              </div>

              <div className="field full">
                <label htmlFor="message">
                  Anything else we should know? <span>(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  maxLength={500}
                  placeholder="Briefly describe the care requirement"
                  value={values.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              id="submitButton"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Submitting request...' : 'Preview request'} <span aria-hidden="true">→</span>
            </button>

            <p className="form-note">
              Enquiries are securely processed and coordinated by our Noblecare4u care team.
            </p>

            <div
              ref={errorRef}
              className={`server-error ${serverError ? 'show' : ''}`}
              id="serverError"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
            >
              {serverError}
            </div>

            <div
              ref={successRef}
              className={`success ${isSuccess ? 'show' : ''}`}
              id="success"
              role="status"
              aria-live="polite"
              tabIndex={-1}
            >
              {successMessage}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
