defmodule Beacon.LiveAdmin.VisualEditor.Utils do
  def parse_number_and_unit(string) do
    # Regex to match integers or floats at the start of the string
    regex = ~r/^\s*(-?\d+(\.\d+)?)/

    case Regex.run(regex, string, return: :index) do
      [{start, length} | _] ->
        # Extract the numeric part and the remaining text
        numeric_part = String.slice(string, start, length)
        remaining_text = String.slice(string, (start + length)..-1)

        # Try parsing as integer first
        case Integer.parse(numeric_part) do
          {int, ""} ->
            {:ok, int, remaining_text}

          _ ->
            # If not an integer, parse as float
            case Float.parse(numeric_part) do
              {float, ""} -> {:ok, float, remaining_text}
              _ -> {:error, :not_a_number}
            end
        end

      _ ->
        {:error, :not_a_number}
    end
  end

  def parse_integer_or_float(string) do
    case Integer.parse(string) do
      {int, ""} ->
        {:ok, int}

      _ ->
        case Float.parse(string) do
          {float, ""} -> {:ok, float}
          _ -> :error
        end
    end
  end
end
