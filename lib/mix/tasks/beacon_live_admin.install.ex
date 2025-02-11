if Code.ensure_loaded?(Igniter) do
  defmodule Mix.Tasks.BeaconLiveAdmin.Install do
    use Igniter.Mix.Task

    @example "mix beacon_live_admin.install"
    @shortdoc "Installs Beacon LiveAdmin in a Phoenix LiveView app."

    @moduledoc """
    #{@shortdoc}

    ## Examples

    ```bash
    mix beacon_live_admin.install
    ```

    ```bash
    mix beacon_live_admin.install --path /admin
    ```

    ## Options

    * `--path` (optional, defaults to "/admin") - Where admin will be mounted. Follows the same convention as Phoenix route prefixes.

    """

    @doc false
    def info(_argv, _composing_task) do
      %Igniter.Mix.Task.Info{
        group: :beacon_live_admin,
        example: @example,
        schema: [path: :string],
        defaults: [path: "/admin"],
        required: [:path]
      }
    end

    @doc false
    def igniter(igniter) do
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
end
