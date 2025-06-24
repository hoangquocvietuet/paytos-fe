import { Scanner } from "@yudiel/react-qr-scanner";

export const QRCode = () => {
  return (
    <Scanner
      styles={{
        container: {
          width: "40%",
          height: "40%",
        },
      }}
      onScan={(result) => console.log(result)}
    />
  );
};
