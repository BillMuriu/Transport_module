import React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const StudentItem = ({ student, index, onCheck, sending, sent }) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="p-3 border rounded-md flex items-center space-x-3"
    >
      {sent ? (
        <span className="text-green-600 text-sm font-medium">Sent ✅</span>
      ) : sending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Checkbox
          checked={false}
          onCheckedChange={(checked) => onCheck(checked, student)}
        />
      )}
      <span className="text-sm text-muted-foreground">
        {student.first_name} {student.last_name} – {student.class_name}
      </span>
    </motion.li>
  );
};

export default StudentItem;
