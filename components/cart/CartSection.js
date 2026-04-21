"use client";

import { useState } from "react";
import styles from "./CartSection.module.css";
import { CartIcon } from "@/components/header/icons";

const STEPS = ["Cart", "Checkout", "Confirmation"];

function getNextButtonLabel(currentStep) {
  if (currentStep === 1) return "Proceed to Checkout";
  if (currentStep === 2) return "Place Demo Order";
  return "Back to Cart";
}

export default function CartSection() {
  const [currentStep, setCurrentStep] = useState(1);

  const progressWidth = `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`;

  const handleNextStep = () => {
    setCurrentStep((prev) => (prev === STEPS.length ? 1 : prev + 1));
  };

  return (
    <section className={styles.cartPage}>
      <div className={styles.inner}>
        {/* Top progress stepper */}
        <div className={styles.stepper}>
          <div className={styles.stepperLine} />
          <div
            className={styles.stepperFill}
            style={{ width: progressWidth }}
          />

          <div className={styles.stepItems}>
            {STEPS.map((label, index) => {
              const stepNumber = index + 1;

              const stepClassName = [
                styles.step,
                stepNumber < currentStep ? styles.completed : "",
                stepNumber === currentStep ? styles.active : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={label} className={stepClassName}>
                  <span className={styles.stepDot} />
                  <span className={styles.stepLabel}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className={styles.contentGrid}>
          {/* Left side */}
          <div className={styles.cartPanel}>
            {currentStep === 1 && (
              <div className={styles.emptyState}>
                <div className={styles.bagIcon} aria-hidden="true">
                  <CartIcon className={styles.bagSvg} />
                </div>

                <p className={styles.emptyText}>Your cart is empty</p>

                <button className={styles.shopButton}>Continue Shopping</button>
              </div>
            )}

            {currentStep === 2 && (
              <div className={styles.checkoutState}>
                <p className={styles.panelEyebrow}>Checkout</p>
                <h1 className={styles.panelTitle}>Complete your details</h1>
                <p className={styles.panelText}>
                  This sample checkout view is ready for future billing,
                  delivery, and payment integrations.
                </p>

                <div className={styles.checkoutGrid}>
                  <label className={styles.fieldLabel}>
                    Email
                    <input
                      className={styles.fieldInput}
                      type="email"
                      placeholder="collector@example.com"
                    />
                  </label>
                  <label className={styles.fieldLabel}>
                    Full name
                    <input
                      className={styles.fieldInput}
                      type="text"
                      placeholder="Your name"
                    />
                  </label>
                  <label className={styles.fieldLabel}>
                    Delivery address
                    <input
                      className={styles.fieldInput}
                      type="text"
                      placeholder="Street address"
                    />
                  </label>
                  <label className={styles.fieldLabel}>
                    City
                    <input
                      className={styles.fieldInput}
                      type="text"
                      placeholder="Montréal"
                    />
                  </label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.confirmationState}>
                <div className={styles.confirmationMark} aria-hidden="true">
                  <span />
                </div>
                <p className={styles.panelEyebrow}>Confirmation</p>
                <h1 className={styles.panelTitle}>Request received</h1>
                <p className={styles.panelText}>
                  This sample confirmation page shows where order details,
                  receipt information, and next steps will appear.
                </p>

                <div className={styles.confirmationSummary}>
                  <span>Demo order</span>
                  <strong>AG-2026-001</strong>
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <aside className={styles.servicePanel}>
            <div className={styles.serviceHeader}>Customer Service</div>

            <div className={styles.serviceBody}>
              <p>Monday to Saturday 9am - 6pm EST :</p>
              <a href="tel:18557708626" className={styles.servicePhone}>
                1-855-770-8626
              </a>
            </div>

            <div className={styles.serviceFeatures}>
              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M3 7h11v8H3z" />
                  <path d="M14 10h3l4 3v2h-7z" />
                  <circle cx="7" cy="18" r="1.7" />
                  <circle cx="18" cy="18" r="1.7" />
                </svg>
                <span>
                  Free standard
                  <br />
                  delivery
                </span>
              </div>

              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M7 7H21" />
                  <path d="M17 3l4 4-4 4" />
                  <path d="M17 17H3" />
                  <path d="M7 13l-4 4 4 4" />
                </svg>
                <span>
                  Returns &
                  <br />
                  exchanges
                </span>
              </div>

              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  <rect x="5" y="10" width="14" height="10" rx="1" />
                  <path d="M12 14v3" />
                </svg>
                <span>Shop securely</span>
              </div>
            </div>
          </aside>
        </div>

        <div className={styles.demoFlowControls}>
          <button type="button" className={styles.nextButton} onClick={handleNextStep}>
            {getNextButtonLabel(currentStep)}
          </button>
        </div>
      </div>
    </section>
  );
}
