import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ loading }: { loading: boolean | undefined }) => {
  const override: CSSProperties = {
    display: "block",
    margin: "100px auto",
    borderColor: "#3b82bf",
  };

  return (
    <ClipLoader
      color="#3b82bf"
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
};

export default Loader;
