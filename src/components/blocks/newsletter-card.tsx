import { messages } from '@/messages';
import { websiteConfig } from '@/config/website';
import { useSubscribeNewsletter } from '@/hooks/use-newsletter';
import { HeaderSection } from '@/components/shared/header-section';
import { FormError } from '@/components/shared/form-error';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader2, IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const m = messages.newsletter;

const schema = z.object({
  email: z.email(m.emailInvalid),
});

type FormData = z.infer<typeof schema>;

export function NewsletterCard() {
  const enabled = websiteConfig.newsletter?.enable ?? false;
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const subscribeMutation = useSubscribeNewsletter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const isPending = subscribeMutation.isPending;

  async function onSubmit(data: FormData) {
    setError(undefined);
    setSuccess(false);
    try {
      await subscribeMutation.mutateAsync(data.email);
      setSuccess(true);
      form.reset();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : m.error;
      setError(errMsg);
    }
  }

  if (!enabled) return null;

  return (
    <div className="w-full rounded-lg bg-muted/50 p-16">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderSection
          title={m.title}
          subtitle={m.subtitle}
          description={m.description}
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full max-w-md flex-col items-center gap-4"
          >
            <div className="flex w-full items-center">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative w-full space-y-0">
                    <FormLabel className="sr-only">{m.email}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={m.placeholderEmail}
                        className="h-12 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2 focus:border-r-0"
                        {...field}
                      />
                    </FormControl>
                    <div className="absolute -bottom-6 left-0">
                      <FormMessage className="text-destructive text-sm" />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-12 rounded-l-none cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <IconLoader2 className="size-6 animate-spin" aria-hidden />
                ) : (
                  <IconSend className="size-6" aria-hidden />
                )}
                <span className="sr-only">{m.subscribe}</span>
              </Button>
            </div>
            {error && (
              <div className="w-full">
                <FormError message={error} />
              </div>
            )}
            {success && (
              <p className="text-muted-foreground text-sm">{m.thanks}</p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
