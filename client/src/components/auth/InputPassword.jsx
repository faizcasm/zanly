import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function InputPassword({ placeholder,name,value,onChange}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 mb-3"
        value={value}
        onChange={onChange}
      />
      <span
        className="absolute right-3 top-4 cursor-pointer text-gray-500"
        onClick={() => setShow(!show)}
      >
        {show ? <FaEyeSlash color="black"/> : <FaEye color="black"/>}
      </span>
    </div>
  );
}

export default InputPassword