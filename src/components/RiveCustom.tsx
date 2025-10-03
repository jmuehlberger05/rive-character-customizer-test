import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
} from "@rive-app/react-canvas";
import { useEffect } from "react";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Normalize hex string
  let sanitized = hex.trim().replace(/^#/, "");

  // Support shorthand (#abc → #aabbcc)
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (!/^[0-9A-Fa-f]{6}$/.test(sanitized)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);

  return { r, g, b };
}

function intToHex(color: number): string {
  // Ensure we work with the lower 24 bits only (ignore alpha channel if present)
  const hex = (color & 0xffffff).toString(16).toUpperCase();

  // Pad with leading zeros if necessary
  return `#${hex.padStart(6, "0")}`;
}

const RiveCustom = () => {
  const { rive, RiveComponent } = useRive({
    // Load a local riv `clean_the_car.riv` or upload your own!
    src: "/rive/color_test.riv",
    // Be sure to specify the correct state machine (or animation) name
    stateMachines: "StateMachine",
    // Autoplay the state machine
    autoplay: true,
    // This uses the view model instance defined in Rive
    autoBind: true,
  });

  const viewModel = useViewModel(rive, { name: "Main" });
  const vmi = useViewModelInstance(viewModel, { rive });

  const { value: color, setRgb: setColor } = useViewModelInstanceColor(
    "col1",
    vmi
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    const { r, g, b } = hexToRgb(e.target.value);
    console.log(r, g, b);
    setColor(r, g, b);
  };

  const handleRadioSelect = (type: number) => {
    console.log(type);

    switch (type) {
      case 1:
        // Grün
        setColor(0, 255, 0);
        break;
      case 2:
        // Braun
        setColor(150, 75, 0);
        break;
      case 3:
        // Blau
        setColor(0, 0, 255);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (color) {
      console.log("Color changed:", intToHex(color));
    }
  }, [color]);

  return (
    <div>
      <RiveComponent className="w-96 h-96" />

      <input
        type="color"
        value={intToHex(color || 0)}
        onChange={handleColorChange}
        className="mt-4"
      />

      <fieldset>
        <legend className="text-white">Augenfarbe</legend>
        <div className="flex gap-2 p-2">
          <input
            type="radio"
            name="phenotype"
            id="phenotype1"
            onChange={() => handleRadioSelect(1)}
          />
          <label htmlFor="phenotype1" className="text-white">
            Grün
          </label>
        </div>
        <div className="flex gap-2 p-2">
          <input
            type="radio"
            name="phenotype"
            id="phenotype2"
            onChange={() => handleRadioSelect(2)}
          />
          <label htmlFor="phenotype2" className="text-white">
            Braun
          </label>
        </div>
        <div className="flex gap-2 p-2">
          <input
            type="radio"
            name="phenotype"
            id="phenotype3"
            onChange={() => handleRadioSelect(3)}
          />
          <label htmlFor="phenotype3" className="text-white">
            Blau
          </label>
        </div>
      </fieldset>
    </div>
  );
};

export default RiveCustom;
