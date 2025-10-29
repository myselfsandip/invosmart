import type { Dispatch, SetStateAction } from "react";
import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

function DashboardCommand({ open, setOpen }: Props) {
    return (
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Find a meeting or agent"
            />
            <CommandList >
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    );
}

export default DashboardCommand;