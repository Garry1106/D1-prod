import { Button } from '@/components/ui/button';

export function SuccessMessage({ onReset }: { onReset: () => void }) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-[#EB6C33]">Group Created Successfully!</h2>
            <p className="mt-2 text-white/80">Your group has been successfully created.</p>
            <Button onClick={onReset} className="mt-4 bg-[#EB6C33] text-white">
                Create Another Group
            </Button>
        </div>
    );
}
