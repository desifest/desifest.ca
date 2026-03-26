// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Digit = ({ value, delay = 0 }) => {
  const numbers = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="overflow-hidden h-42">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -value * 190 }}
        transition={{
          duration: 1.6,
          ease: "easeOut",
          delay,
        }}
      >
        {numbers.map((num) => (
          <div
            key={num}
            className="h-47.5 flex items-center justify-center"
          >
            {num}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Digit;
