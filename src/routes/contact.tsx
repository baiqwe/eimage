import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { ContactFormCard } from '@/components/contact/contact-form-card';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl space-y-8 pb-16">
        <div className="space-y-4">
          <h1 className="text-center text-3xl font-bold tracking-tight">
            Contact
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            Send us a message and we will get back to you.
          </p>
        </div>
        <ContactFormCard />
      </div>
    </Container>
  );
}
