interface RadioGroupProps<T extends string>
  extends Pick<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "name" | "id" | "disabled"
  > {
  selectedValue: T;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: T) => void;
  values: T[] | readonly T[];
}

export default function RadioGroup<T extends string>({
  onChange,
  selectedValue,
  values,
  ...props
}: RadioGroupProps<T>) {
  return (
    <fieldset {...props}>
      {values.map((value) => (
        <label key={value}>
          {value}
          <input
            value={value}
            type="radio"
            checked={selectedValue === value}
            onChange={(e) => {
              onChange(e, e.target.value as T);
            }}
          />
        </label>
      ))}
    </fieldset>
  );
}
