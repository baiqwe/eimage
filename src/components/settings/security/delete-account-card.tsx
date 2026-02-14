import { FormError } from '@/components/layout/form-error';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export function DeleteAccountCard() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const { data: session, refetch } = authClient.useSession();
  const navigate = useNavigate();

  const user = session?.user;
  if (!user) return null;

  const handleDeleteAccount = async () => {
    await authClient.deleteUser(
      {},
      {
        onRequest: () => {
          setIsDeleting(true);
          setError('');
        },
        onResponse: () => {
          setIsDeleting(false);
          setShowConfirmation(false);
        },
        onSuccess: () => {
          toast.success('Account deleted successfully');
          refetch();
          navigate({ to: '/' });
        },
        onError: (ctx) => {
          setError(`${ctx.error.status}: ${ctx.error.message}`);
          toast.error('Failed to delete account');
        },
      },
    );
  };

  return (
    <Card className={cn('w-full border-destructive/50 overflow-hidden pt-6 pb-0 flex flex-col')}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-destructive">Delete Account</CardTitle>
        <CardDescription>Permanently remove your account and all of its contents</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          This action is not reversible, so please continue with caution
        </p>
        {error && (
          <div className="mt-4">
            <FormError message={error} />
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-2 px-6 py-4 flex justify-end items-center bg-muted rounded-none">
        <Button
          variant="destructive"
          onClick={() => setShowConfirmation(true)}
          className="cursor-pointer"
        >
          Delete Account
        </Button>
      </CardFooter>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
