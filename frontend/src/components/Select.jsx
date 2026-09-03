function Select({
    label,
    value,
    onChange,
    options = [],
    name
}) {
    return (
        <label>
            {label}

            <select
                value={value}
                onChange={onChange}
                name={name}
            >
                <option value="">
                    Выберите вариант
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default Select;