defmodule Beacon.LiveAdmin.Config do
  @moduledoc """
  Configuration for Admin instances.

  See `new/1` for available options and examples.
  """

  @doc false
  use GenServer

  alias Beacon.LiveAdmin.ConfigError

  @doc false
  def name(name) do
    Beacon.Registry.via({name, __MODULE__})
  end

  @doc false
  def start_link(config) do
    GenServer.start_link(__MODULE__, config, name: Beacon.Registry.via({config.name, __MODULE__}, config))
  end

  @doc false
  def init(config) do
    {:ok, config}
  end

  @typedoc """
  Name to identify an Admin instance.
  """
  @type name :: atom()

  @type t :: %__MODULE__{
          name: name()
        }

  defstruct name: nil

  @type option ::
          {:name, name()}

  @doc """
  Build a new `%Beacon.LiveAdmin.Config{}` to hold the entire configuration for each Admin instance.

  ## Options

    * `:site` - `t:name/0` (required). Name of the Admin instance, must be unique. Defaults to `:admin`.

  ## Example

      iex> Beacon.LiveAdmin.Config.new(
        name: :my_admin
      )
      %Beacon.LiveAdmin.Config{
        name: :my_admin
      }

  """
  @spec new([option]) :: t()
  def new(opts) do
    # TODO: validate opts, maybe use nimble_options

    opts =
      opts
      |> Keyword.put_new(:name, :admin)

    struct!(__MODULE__, opts)
  end

  @doc """
  Returns the `Beacon.LiveAdmin.Config` for instance `name`.
  """
  @spec fetch!(name()) :: t()
  def fetch!(name) when is_atom(name) do
    case Beacon.Registry.lookup({name, __MODULE__}) do
      {_pid, config} ->
        config

      _ ->
        raise ConfigError, """
        Admin instance #{inspect(name)} not found. Make sure it's configured and started,
        see `Beacon.LiveAdmin.start_link/1` for more info.
        """
    end
  end
end
