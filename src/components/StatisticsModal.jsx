import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const StatisticsModal = () => {
  return (
    <DialogContent className="max-w-[80vw] max-h-[80vh] h-[80vh] w-[80vw]">
      <DialogHeader className="h-min">
        <DialogTitle className="text-3xl">Statistics</DialogTitle>
        <DialogDescription className="text-lg text-gray-500">
          Hi there, here will be your statistic
        </DialogDescription>
        <div className="flex flex-col h-full">
          <ul className="list-disc list-inside mt-8 text-base">
            <li>Point 1</li>
            <li>Point 2</li>
            <li>Point 3</li>
          </ul>
        </div>
      </DialogHeader>

      <DialogFooter className="absolute bottom-8 right-8">
        <DialogClose asChild>
          <Button size="lg">Ok</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default StatisticsModal;
