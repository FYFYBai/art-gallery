"use client";

import { useState } from "react";
import { useTranslations } from "../../i18n/IntlContext";
import styles from "./CartSection.module.css";
import { CartIcon } from "@/components/header/icons";

export default function CartSection() {
  const t = useTranslations("cart");
  const [currentStep, setCurrentStep] = useState(1);

  const STEPS = [t("stepCart"), t("stepCheckout"), t("stepConfirmation")];

  const progressWidth = `${((currentStep - 0.5) / STEPS.length) * 100}%`;
  const progressTrackWidth = `${((STEPS.length - 0.5) / STEPS.length) * 100}%`;

  const getNextButtonLabel = () => {
    if (currentStep === 1) return t("proceedToCheckout");
    if (currentStep === 2) return t("placeDemoOrder");
    return t("backToCart");
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => (prev === STEPS.length ? 1 : prev + 1));
  };

  return (
    <section className={styles.cartPage}>
      <div className={styles.inner}>
        <div className={styles.stepper}>
          <div className={styles.stepperLine} style={{ width: progressTrackWidth }} />
          <div className={styles.stepperFill} style={{ width: progressWidth }} />

          <div className={styles.stepItems}>
            {STEPS.map((label, index) => {
              const stepNumber = index + 1;
              const stepClassName = [
                styles.step,
                stepNumber < currentStep ? styles.completed : "",
                stepNumber === currentStep ? styles.active : "",
              ].filter(Boolean).join(" ");

              return (
                <div key={label} className={stepClassName}>
                  <span className={styles.stepDot} />
                  <span className={styles.stepLabel}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.cartPanel}>
            {currentStep === 1 && (
              <div className={styles.emptyState}>
                <div className={styles.bagIcon} aria-hidden="true">
                  <CartIcon className={styles.bagSvg} />
                </div>
                <p className={styles.emptyText}>{t("emptyCart")}</p>
                <button className={styles.shopButton}>{t("continueShopping")}</button>
              </div>
            )}

            {currentStep === 2 && (
              <div className={styles.checkoutState}>
                <p className={styles.panelEyebrow}>{t("checkoutEyebrow")}</p>
                <h1 className={styles.panelTitle}>{t("checkoutTitle")}</h1>
                <p className={styles.panelText}>{t("checkoutText")}</p>

                <div className={styles.checkoutGrid}>
                  <label className={styles.fieldLabel}>
                    {t("emailLabel")}
                    <input className={styles.fieldInput} type="email" placeholder={t("emailPlaceholder")} />
                  </label>
                  <label className={styles.fieldLabel}>
                    {t("fullNameLabel")}
                    <input className={styles.fieldInput} type="text" placeholder={t("fullNamePlaceholder")} />
                  </label>
                  <label className={styles.fieldLabel}>
                    {t("addressLabel")}
                    <input className={styles.fieldInput} type="text" placeholder={t("addressPlaceholder")} />
                  </label>
                  <label className={styles.fieldLabel}>
                    {t("cityLabel")}
                    <input className={styles.fieldInput} type="text" placeholder={t("cityPlaceholder")} />
                  </label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.confirmationState}>
                <div className={styles.confirmationMark} aria-hidden="true">
                  <span />
                </div>
                <p className={styles.panelEyebrow}>{t("confirmationEyebrow")}</p>
                <h1 className={styles.panelTitle}>{t("confirmationTitle")}</h1>
                <p className={styles.panelText}>{t("confirmationText")}</p>
                <div className={styles.confirmationSummary}>
                  <span>{t("demoOrder")}</span>
                  <strong>AG-2026-001</strong>
                </div>
              </div>
            )}
          </div>

          <aside className={styles.servicePanel}>
            <div className={styles.serviceHeader}>{t("customerService")}</div>
            <div className={styles.serviceBody}>
              <p>{t("serviceHours")}</p>
              <a href="tel:18557708626" className={styles.servicePhone}>1-855-770-8626</a>
            </div>

            <div className={styles.serviceFeatures}>
              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M3 7h11v8H3z" />
                  <path d="M14 10h3l4 3v2h-7z" />
                  <circle cx="7" cy="18" r="1.7" />
                  <circle cx="18" cy="18" r="1.7" />
                </svg>
                <span>{t("freeDelivery")}</span>
              </div>
              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M7 7H21" />
                  <path d="M17 3l4 4-4 4" />
                  <path d="M17 17H3" />
                  <path d="M7 13l-4 4 4 4" />
                </svg>
                <span>{t("returnsExchanges")}</span>
              </div>
              <div className={styles.featureItem}>
                <svg viewBox="0 0 24 24" className={styles.featureIcon}>
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  <rect x="5" y="10" width="14" height="10" rx="1" />
                  <path d="M12 14v3" />
                </svg>
                <span>{t("shopSecurely")}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className={styles.demoFlowControls}>
          <button type="button" className={styles.nextButton} onClick={handleNextStep}>
            {getNextButtonLabel()}
          </button>
        </div>
      </div>
    </section>
  );
}
