// WhatsApp message templates (HSM - Highly Structured Messages)
// These templates must be pre-approved by Meta

export interface WhatsAppTemplate {
  name: string;
  language: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  components?: any[];
}

export const whatsappTemplates = {
  // Welcome message when customer first contacts
  welcome: {
    name: "welcome_tan_co",
    language: "he",
    category: "MARKETING" as const,
  },

  // Send purchase options with checkout link
  purchaseOptions: {
    name: "purchase_options",
    language: "he",
    category: "MARKETING" as const,
  },

  // Confirmation after successful payment
  paymentSuccess: {
    name: "payment_success",
    language: "he",
    category: "UTILITY" as const,
  },

  // Send health form link
  healthForm: {
    name: "health_form_link",
    language: "he",
    category: "UTILITY" as const,
  },

  // Send face registration link
  faceRegistration: {
    name: "face_registration_link",
    language: "he",
    category: "UTILITY" as const,
  },

  // Onboarding complete
  onboardingComplete: {
    name: "onboarding_complete",
    language: "he",
    category: "UTILITY" as const,
  },
};

// Helper to build template messages with parameters
export function buildTemplateMessage(
  templateKey: keyof typeof whatsappTemplates,
  parameters: Record<string, string> = {}
) {
  const template = whatsappTemplates[templateKey];
  
  const components: any[] = [];
  
  // Add body parameters if provided
  if (Object.keys(parameters).length > 0) {
    components.push({
      type: "body",
      parameters: Object.values(parameters).map(value => ({
        type: "text",
        text: value
      }))
    });
  }
  
  return {
    type: "template",
    template: {
      name: template.name,
      language: { code: template.language },
      components: components.length > 0 ? components : undefined,
    },
  };
}
