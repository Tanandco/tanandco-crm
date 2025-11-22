import {
  Sparkles,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

import icon1 from "@assets/8_1759907913839.png";
import icon2 from "@assets/10_1759907919939.png";
import icon3 from "@assets/11_1759907922694.png";
import icon4 from "@assets/9_1759907875344.png";

export default function HairStudio() {
  const [selected, setSelected] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const services = [
    {
      id: 1,
      title: "תספורת גברים",
      icon: icon1,
      description: "תספורת מדויקת עם סטייל",
      price: 120,
    },
    {
      id: 2,
      title: "פן / עיצוב שיער",
      icon: icon2,
      description: "עיצוב שיער מהיר ומושלם",
      price: 90,
    },
    {
      id: 3,
      title: "תספורת נשים",
      icon: icon3,
      description: "תספורת ועיצוב מלא",
      price: 160,
    },
    {
      id: 4,
      title: "טיפול הזנה",
      icon: icon4,
      description: "החלקה עדינה / מסכה מזינה",
      price: 110,
    },
  ];

  const goToCheckout = () => {
    if (!selected) return;
    setLocation(`/checkout/${selected}`);
  };

  return (
    <div className="p-6 text-right">
      <h1 className="text-3xl font-bold mb-4 flex items-center justify-end gap-2">
        <Sparkles className="w-6 h-6 text-pink-400" />
        שירותי המספרה
      </h1>

      <div className="grid gap-4">
        {services.map((srv) => (
          <button
            key={srv.id}
            onClick={() => setSelected(srv.id)}
            className={`
              border rounded-xl p-4 flex items-center justify-between
              hover:bg-gray-100 transition
              ${selected === srv.id ? "border-pink-500 bg-pink-50" : ""}
            `}
          >
            <div className="text-right">
              <h3 className="text-xl font-semibold">{srv.title}</h3>
              <p className="text-sm text-gray-600">{srv.description}</p>
              <p className="text-lg font-bold mt-1">{srv.price} ₪</p>
            </div>

            <img src={srv.icon} alt="" className="w-16 h-16 rounded-lg" />
          </button>
        ))}
      </div>

      <Button
        disabled={!selected}
        onClick={goToCheckout}
        className="mt-6 w-full flex justify-center gap-2"
      >
        מעבר לתשלום
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
