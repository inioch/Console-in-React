import "./App.css";
import { useRef, useEffect, useState } from "react";

function App() {
	// nazwa komputera
	const userAgent = navigator.userAgent;
	let os;
	if (userAgent.indexOf("Win") !== -1) os = "Windows";
	else if (userAgent.indexOf("Mac") !== -1) os = "Macintosh";
	else if (userAgent.indexOf("Linux") !== -1) os = "Linux";
	else if (userAgent.indexOf("Android") !== -1) os = "Android";
	else if (userAgent.indexOf("iOS") !== -1) os = "iOS";
	else os = "Nieznany";

	const workstation = "Operating system: " + os;

	// utzymanie focus na input
	const inputRef = useRef(null);
	useEffect(() => {
		inputRef.current.focus();
		const handleClickOutside = (event) => {
			if (inputRef.current && !inputRef.current.contains(event.target)) {
				inputRef.current.focus();
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	// Zapisywanie wpisanej tresci
	const [inputValue, setInputValue] = useState("");
	// lista wpisanych rzeczy
	const [inputValueList, setInputValueList] = useState([]);
	// index wpisanych rzeczy
	const [inputValueIndex, setInputValueIndex] = useState(-1);
	// Wiadomość o nieznanej komendzie
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (event) => {
		setInputValue(event.target.value);
		setErrorMessage("");
	};
	// obsługa strzałek
	const handleKeyDown = (event) => {
		if (event.key === "ArrowUp") {
			event.preventDefault(); // Zapobiegamy przewijaniu strony w górę
			if (inputValueIndex < inputValueList.length - 1) {
				setInputValueIndex(inputValueIndex + 1);
				setInputValue(inputValueList[inputValueIndex + 1]);
			}
		} else if (event.key === "ArrowDown") {
			event.preventDefault(); // Zapobiegamy przewijaniu strony w dół
			if (inputValueIndex > 0) {
				setInputValueIndex(inputValueIndex - 1);
				setInputValue(inputValueList[inputValueIndex - 1]);
			}
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (inputValue.trim() !== "") {
			const suggestion = checkField(inputValue);
			if (suggestion !== null) {
				setInputValueList([...inputValueList, suggestion]);
			} else {
				setInputValueList([...inputValueList, inputValue]);
				setErrorMessage("Unknown command. Type help, for more informations.");
			}
		}
		setInputValue("");
	};
	// sprawdzenie wartości
	const checkField = (inputValue) => {
		switch (inputValue.toLowerCase()) {
			case "help":
				return "date - display current date, time - display current time, clean - refresh the page";
			case "clean":
				window.location.reload();
				break;
			case "date":
				return new Date().toLocaleDateString();
			case "time":
				return new Date().toLocaleTimeString();
			default:
				return null;
		}
	};

	return (
		<form
			autoComplete="off"
			className="App"
			onSubmit={handleSubmit}>
			<p>{workstation}</p>
			<p className="pb">All rights reserved.</p>

			{errorMessage && <p className="error">{errorMessage}</p>}

			<div>
				{inputValueList.map((item, index) => (
					<p key={index}>{item}</p>
				))}
			</div>

			<input
				type="text"
				name="enteredValue"
				id="enteredValue"
				ref={inputRef}
				value={inputValue}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder="Type help, for help"
			/>
		</form>
	);
}

export default App;
