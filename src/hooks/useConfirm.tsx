"use client"

import { useState, useCallback, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { CommandResponsiveDialog } from "@/components/ui/command";

interface ConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface ConfirmState {
    isOpen: boolean;
    resolve: ((value: boolean) => void) | null;
    options: ConfirmOptions;
}

export function useConfirm(): { ConfirmDialog: () => JSX.Element | null, confirm: (options?: ConfirmOptions) => Promise<boolean> } {
    const [state, setState] = useState<ConfirmState>({
        isOpen: false,
        resolve: null,
        options: {},
    });

    const confirm = useCallback((options: ConfirmOptions = {}): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                resolve,
                options: {
                    title: "Confirm Action",
                    description: "Are you sure you want to perform this action?",
                    confirmText: "Confirm",
                    cancelText: "Cancel",
                    variant: "default",
                    ...options,
                },
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (state.resolve) {
            state.resolve(true);
        }
        setState(prev => ({ ...prev, isOpen: false, resolve: null }));
    }, [state.resolve]);

    const handleCancel = useCallback(() => {
        if (state.resolve) {
            state.resolve(false);
        }
        setState(prev => ({ ...prev, isOpen: false, resolve: null }));
    }, [state.resolve]);

    const ConfirmDialog = useCallback(() => {
        if (!state.isOpen) return null;

        return (
            <CommandResponsiveDialog
                open={state.isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCancel();
                    }
                }}
                title={state.options.title}
                description={state.options.description}
                className="max-w-md"
            >
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{state.options.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {state.options.description}
                        </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                        >
                            {state.options.cancelText}
                        </Button>
                        <Button
                            variant={state.options.variant}
                            onClick={handleConfirm}
                        >
                            {state.options.confirmText}
                        </Button>
                    </div>
                </div>
            </CommandResponsiveDialog>
        );
    }, [state, handleConfirm, handleCancel]);

    return {
        ConfirmDialog,
        confirm,
    };
}