import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { MdOutlineDarkMode } from "react-icons/md";
import { BsFillMoonFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ChakraProvider,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import sound from '../src/assets/sound.mp3'

function App() {
  const [text, setText] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const storedTheme = localStorage.getItem("theme");
  const toastifyTheme = storedTheme === "dark" ? "dark" : "light";
  const audio = useRef(new Audio(sound));

  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem("list") || "[]");
    if (storedValues) {
      setValues(storedValues);
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsChecked(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsChecked(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const Add = () => {
    if (text === "") {
      toast.error("The task cannot be empty!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: toastifyTheme,
      });
      return;
    } else {
      const updatedValues = [...values, text];
      setValues(updatedValues);
      localStorage.setItem("list", JSON.stringify(updatedValues));
      setText("");
      toast.success("Task added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: toastifyTheme,
      });
    }
  };

  const handleDelete = (indexToRemove: number) => {
    const updatedValues = values.filter((_, index) => index !== indexToRemove);
    setValues(updatedValues);
    localStorage.setItem("list", JSON.stringify(updatedValues));
    toast.success("Task deleted!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: toastifyTheme,
    });
  };
  
  const handleConfirm = (indexToRemove: number) => {
    const updatedValues = values.filter((_, index) => index !== indexToRemove);
    setValues(updatedValues);
    localStorage.setItem("list", JSON.stringify(updatedValues));
    audio.current.play();
    toast.success("Task completed!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: toastifyTheme,
    });
  };

  const handleEdit = (index: number | null) => {
    setEditableIndex(index);
  };

  const handleInputChange = (index: number, newValue: string) => {
    const updatedValues = [...values];
    updatedValues[index] = newValue;
    setValues(updatedValues);
    localStorage.setItem("list", JSON.stringify(updatedValues));
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ChakraProvider>
      <div className="relative dark:bg-zinc-950 bg-zinc-300 text-zinc-950 dark:text-zinc-500 pb-60 lg:pb-0 w-screen h-screen overflow-x-hidden overflow-y-auto flex flex-col items-center caret-zinc-500">
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
        <div
          className="absolute right-4 top-4 flex items-center justify-center text-5xl hover:bg-zinc-500 hover:text-zinc-900 rounded-full h-10 w-10 p-2 cursor-pointer"
          onClick={onOpen}
        >
          <MdOutlineDarkMode />
        </div>
        <p className="text-3xl font-semibold mt-8">To Do List</p>
        <div className="flex items-center w-fit h-fit my-10">
          <input
            type="text"
            className="bg-transparent ml-10 lg:ml-0 w-[60vw] lg:w-[20vw] h-8 text-xl outline-none border-b-2 dark:border-zinc-500 border-zinc-950"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <FaPlus
            onClick={Add}
            className="text-5xl dark:hover:bg-zinc-500 dark:hover:text-zinc-800 hover:bg-zinc-950 hover:text-zinc-300 active:opacity-70 active:translate-y-[1px] mx-2 rounded-md h-10 w-10 p-2 cursor-pointer"
          />
        </div>
        <p className="font-medium text-xl underline-offset-4 mt-10">
          Pending tasks
        </p>
        {values.length !== 0 ? (
          values.map((value, index) => (
            <Item
              key={index}
              index={index}
              value={value}
              handleDelete={handleDelete}
              handleConfirm={handleConfirm}
              handleEdit={handleEdit}
              editable={editableIndex === index}
              handleInputChange={handleInputChange}
            />
          ))
        ) : (
          <Empty />
        )}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={1000} width="fit-content">
          <div className="dark:bg-zinc-900 bg-zinc-300 py-8 flex justify-evenly items-center rounded-md w-[80vw] lg:w-[20vw]">
            <BsFillMoonFill className="dark:text-zinc-300 text-zinc-900 text-xl" />
            <p className="dark:text-zinc-300 text-zinc-900">Dark mode</p>
            <label className="flex cursor-pointer select-none items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div
                  className={`box block h-6 w-10 rounded-full dark:bg-zinc-300 bg-zinc-900`}
                ></div>
                <div
                  className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full transition dark:bg-zinc-900 bg-zinc-300 ${
                    isChecked ? "translate-x-full" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

function Item({
  value,
  index,
  handleDelete,
  handleConfirm,
  handleEdit,
  editable,
  handleInputChange,
}: {
  value: string;
  index: number;
  handleDelete: (index: number) => void;
  handleConfirm: (index: number) => void;
  handleEdit: (index: number | null) => void;
  editable: boolean;
  handleInputChange: (index: number, newValue: string) => void;
}) {
  const [editedValue, setEditedValue] = useState(value);
  const storedTheme = localStorage.getItem("theme");
  const toastifyTheme = storedTheme === "dark" ? "dark" : "light";
  const handleBlur = () => {
    if (editedValue.trim() === "") {
      toast.error("The task cannot be empty!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: toastifyTheme,
      });
    } else {
      handleInputChange(index, editedValue);
      toast.success("Task changed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: toastifyTheme,
      });
    }
    handleEdit(null);
  };

  return (
    <div className="flex items-center justify-between dark:bg-zinc-900 bg-zinc-200 shadow-lg w-[70vw] lg:w-[24vw] p-4 rounded-md my-4">
      {editable ? (
        <input
          type="text"
          value={editedValue}
          className="bg-transparent outline-none w-1/2"
          onChange={(e) => setEditedValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span>{value}</span>
      )}
      <div className="flex flex-row-reverse items-center justify-between gap-2">
        <div
          className="cursor-pointer grid place-items-center hover:text-green-800 dark:hover:bg-zinc-500 hover:bg-zinc-300 h-8 w-8 rounded-md"
          onClick={() => handleConfirm(index)}
        >
          <FaRegCheckCircle />
        </div>
        <div
          className="cursor-pointer grid place-items-center hover:text-zinc-800 dark:hover:bg-zinc-500 hover:bg-zinc-300 h-8 w-8 rounded-md"
          onClick={() => handleEdit(index)}
        >
          <LuPencilLine />
        </div>
        <div
          className="cursor-pointer grid place-items-center hover:text-red-900 dark:hover:bg-zinc-500 hover:bg-zinc-300 h-8 w-8 rounded-md"
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
      <HiOutlineEmojiSad className="text-2xl" />
      <p className="italic text-lg">Your list is empty.</p>
    </div>
  );
}

export default App;
