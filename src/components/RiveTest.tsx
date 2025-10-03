import Rive from "@rive-app/react-canvas";

export const Simple = () => (
  <Rive
    src="https://cdn.rive.app/animations/vehicles.riv"
    stateMachines="bumpy"
    className="w-96 h-96"
  />
);
