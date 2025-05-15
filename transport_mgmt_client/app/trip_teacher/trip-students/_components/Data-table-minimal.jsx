import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export default function DataTableMinimalActions({
  selectedCount = 0,
  onClearSelection,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center rounded-md border pr-1 pl-2.5 w-fit">
      <span className="whitespace-nowrap text-xs">
        {selectedCount} selected
      </span>
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-6"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-5"
            onClick={onClearSelection}
          >
            <X className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={10}
          className="flex items-center gap-2 border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900 [&>span]:hidden"
        >
          <p>Clear selection</p>
          <kbd className="select-none rounded border bg-background px-1.5 py-px font-mono font-normal text-[0.7rem] text-foreground shadow-xs">
            <abbr title="Escape" className="no-underline">
              Esc
            </abbr>
          </kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
