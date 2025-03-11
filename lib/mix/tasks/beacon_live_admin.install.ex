defmodule Mix.Tasks.BeaconLiveAdmin.Install.Docs do
  @moduledoc false

  def short_doc do
    "Installs Beacon LiveAdmin in a Phoenix LiveView app."
  end

  def example do
    "mix beacon_live_admin.install"
  end

  def long_doc do
    """
    #{short_doc()}

    ## Examples

    ```bash
    #{example()}
    ```

    ```bash
    mix beacon_live_admin.install --path /cms/admin
    ```

    ## Options

    * `--path` (optional, defaults to "/admin") - Where admin will be mounted. Follows the same convention as Phoenix route prefixes.

    """
  end
end

if Code.ensure_loaded?(Igniter) do
  defmodule Mix.Tasks.BeaconLiveAdmin.Install do
    use Igniter.Mix.Task

    @shortdoc "#{__MODULE__.Docs.short_doc()}"

    @moduledoc __MODULE__.Docs.long_doc()

    # Enable it to execute the task
    # so we can check and display a custom message
    @impl Igniter.Mix.Task
    def supports_umbrella?, do: true

    @impl Igniter.Mix.Task
    def info(_argv, _composing_task) do
      %Igniter.Mix.Task.Info{
        group: :beacon_live_admin,
        example: __MODULE__.Docs.example(),
        schema: [path: :string],
        defaults: [path: "/admin"],
        required: [:path]
      }
    end

    @impl Igniter.Mix.Task
    def igniter(igniter) do
      if Mix.Project.umbrella?() do
        Mix.shell().error("""
        Running 'mix beacon_live_admin.install' in the root of Umbrella apps is not supported yet.

        Please execute that task inside a child app.
        """)

        exit({:shutdown, 1})
      end

      options = igniter.args.options
      path = Keyword.fetch!(options, :path)
      validate_options!(path)

      {igniter, router} = Igniter.Libs.Phoenix.select_router(igniter)

      igniter
      |> Igniter.Project.Formatter.import_dep(:beacon_live_admin)
      |> add_use_beacon_live_admin_in_router(router)
      |> add_admin_pipeline_in_router(router)
      |> mount_admin_in_router(router, path)
    end

    defp validate_options!(path) do
      cond do
        !Beacon.Types.Site.valid_path?(path) -> raise_with_help!("Invalid path value. It should start with /.", path)
        :else -> :ok
      end
    end

    defp raise_with_help!(msg, path) do
      Mix.raise("""
      #{msg}

      mix beacon_live_admin.install expects a valid path, for example:

          mix beacon_live_admin.install --path /admin

      Got:

        #{inspect(path)}

      """)
    end

    defp add_use_beacon_live_admin_in_router(igniter, router) do
      Igniter.Project.Module.find_and_update_module!(igniter, router, fn zipper ->
        case Igniter.Code.Module.move_to_use(zipper, Beacon.LiveAdmin.Router) do
          {:ok, zipper} ->
            {:ok, zipper}

          _ ->
            with {:ok, zipper} <- Igniter.Libs.Phoenix.move_to_router_use(igniter, zipper) do
              {:ok, Igniter.Code.Common.add_code(zipper, "use Beacon.LiveAdmin.Router")}
            end
        end
      end)
    end

    defp add_admin_pipeline_in_router(igniter, router) do
      Igniter.Libs.Phoenix.add_pipeline(
        igniter,
        :beacon_admin,
        "plug Beacon.LiveAdmin.Plug",
        router: router
      )
    end

    defp mount_admin_in_router(igniter, router, path) do
      Igniter.Libs.Phoenix.append_to_scope(
        igniter,
        "/",
        """
        beacon_live_admin #{inspect(path)}
        """,
        with_pipelines: [:browser, :beacon_admin],
        router: router
      )
    end
  end
else
  defmodule Mix.Tasks.BeaconLiveAdmin.Install do
    @shortdoc "Install `igniter` in order to run Beacon generators."

    @moduledoc __MODULE__.Docs.long_doc()

    use Mix.Task

    def run(_argv) do
      Mix.shell().error("""
      The task 'beacon_live_admin.install' requires igniter. Please install igniter and try again.

      For more information, see: https://hexdocs.pm/igniter/readme.html#installation
      """)

      exit({:shutdown, 1})
    end
  end
end
