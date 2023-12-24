import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuPencilLine } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import { TbMoodEmpty } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [text, setText] = useState("");
  const [values, setValues] = useState([]);
  const [editableIndex, setEditableIndex] = useState(null);

  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem("list"));
    if (storedValues) {
      setValues(storedValues);
    }
  }, []);

  const Add = () => {
    if (text == "") {
      toast.error("Fill the text entry below!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    } else {
      const updatedValues = [...values, text];
      setValues(updatedValues);
      localStorage.setItem("list", JSON.stringify(updatedValues));
      setText("");
    }
  };

  const handleDelete = (indexToRemove) => {
    const updatedValues = values.filter((_, index) => index !== indexToRemove);
    setValues(updatedValues);
    localStorage.setItem("list", JSON.stringify(updatedValues));
  };

  const handleEdit = (index) => {
    setEditableIndex(index);
  };

  const handleInputChange = (index, newValue) => {
    const updatedValues = [...values];
    updatedValues[index] = newValue;
    setValues(updatedValues);
    localStorage.setItem("list", JSON.stringify(updatedValues));
  };

  return (
    <div className="bg-zinc-950 text-zinc-500 w-screen h-screen overflow-x-hidden overflow-y-auto flex flex-col items-center caret-zinc-500">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <p className="text-3xl font-bold mt-8">To Do List</p>
      <div className="flex items-center w-fit h-fit my-10">
        <input
          type="text"
          className="bg-transparent ml-10 lg:ml-0 w-[60vw] lg:w-[20vw] h-8 text-xl outline-none border-b-2 border-zinc-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <FaPlus
          onClick={Add}
          className="text-5xl hover:bg-zinc-500 hover:text-zinc-800 active:opacity-70 active:translate-y-[1px] mx-2 rounded-md h-10 w-10 p-2 cursor-pointer"
        />
      </div>
      <p className="font-regular text-xl italic underline-offset-4 mt-10">
        Things to be done
      </p>
      {values.length !== 0 ? (
        values.map((value, index) => (
          <Item
            key={index}
            index={index}
            value={value}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            editable={editableIndex === index}
            handleInputChange={handleInputChange}
          />
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
}

function Item({
  value,
  index,
  handleDelete,
  handleEdit,
  editable,
  handleInputChange,
}) {
  const [editedValue, setEditedValue] = useState(value);

  const handleBlur = () => {
    handleInputChange(index, editedValue);
    handleEdit(null);
  };

  return (
    <div className="flex items-center justify-between bg-zinc-900 w-[70vw] lg:w-[24vw] p-4 rounded-md my-4">
      {editable ? (
        <input
          type="text"
          value={editedValue}
          className="bg-transparent outline-none"
          onChange={(e) => setEditedValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span>{value}</span>
      )}
      <div className="flex items-center justify-between gap-2">
        <div
          className="cursor-pointer grid place-items-center hover:text-zinc-800 hover:bg-zinc-500 h-8 w-8 rounded-md"
          onClick={() => handleEdit(index)}
        >
          <LuPencilLine />
        </div>
        <div
          className="cursor-pointer grid place-items-center hover:text-red-900 hover:bg-zinc-500 h-8 w-8 rounded-md"
          onClick={() => handleDelete(index)}
        >
          <FiTrash2 />
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col justify-center items-center my-20">
      <TbMoodEmpty className="text-2xl" />
      <p className="italic text-lg">Your list is empty.</p>
    </div>
  );
}

export default App;
