import { HeaderSection } from '@/components/layout/header-section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqItems = [
  {
    id: '1',
    question: 'Can I change my plan later?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of the next billing cycle.',
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and wire transfer for annual plans.',
  },
  {
    id: '3',
    question: 'Is there a free trial?',
    answer:
      'Yes, we offer a 14-day free trial on all paid plans. No credit card required.',
  },
  {
    id: '4',
    question: 'What is your refund policy?',
    answer:
      'We offer a 30-day money-back guarantee. Contact support for a full refund.',
  },
  {
    id: '5',
    question: 'How do I get support?',
    answer:
      'Email support is included for all plans. Pro and above get priority support.',
  },
]

export default function FaqSection() {
  return (
    <section id="faqs" className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <HeaderSection
          title="FAQs"
          titleAs="h2"
          subtitle="Frequently asked questions"
          subtitleAs="p"
        />

        <div className="mx-auto mt-12 max-w-4xl">
          <Accordion
            className="w-full rounded-2xl border px-8 py-3 shadow-sm"
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-dashed">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
