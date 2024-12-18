defmodule Beacon.LiveAdmin.StationUI.HTML.Spinner do
  use Phoenix.Component

  @moduledoc """
  The spinner component offers two options (spinner and spinner_double) to render
  an animated looping SVG to represent a loading state.
  Spinners are used to notify users when something is in progress or fetching data.
  When a page or element is updating, the loading animation appears and then resolves once that
  action is complete.
  Each spinner option has a default size but this can be overridden.

  ## Spinner:

  The Spinner is used primarily within UI elements - such as file unloaders / drag and drops
  - to indicate progress when updating content.

  This <span> element is not visible on screen but will still be announced by screen readers to notify
  Assistive Technology users of the loading status.

  Spinner options:

  -- class: Add classes to spinner component in addition to the base defined classes.
            default/medium size: "h-6 w-6" (overridden when specifying a class)

  ### Spinner Example

  <.spinner class="h-11 w-11" />

  Suggested size classes:

  xl: "h-11 w-11"
  lg: "h-8 w-8"
  sm: "h-5 w-5"
  xs: "h-4 w-4"


  ## Double Spinner:

  The Double Spinner is used primarily when a page needs to load before displaying new content.
  It is by default larger than the Spinner and has two rings instead of one.

  This <span> element is not visible on screen but will still be announced by screen readers to notify
  Assistive Technology users of the loading status.

  Double spinner options:

  -- class: Add classes to double spinner component in addition to the base defined classes.
            default/medium size: h-[114px] w-[114px] (overridden when specifying a class)

  ### Double Spinner Example

  <.spinner_double class="h-16 w-16" />

  Suggested size classes:

  xl: "h-[244px] w-[244px]"
  lg: "h-[184px] w-[184px]"
  sm: "h-[84px] w-[84px]"
  xs: "h-16 w-16"

  """

  @base_classes "[&>svg]:animate-spin [&>svg]:fill-[--sui-brand-primary]"
  def base_classes, do: @base_classes

  attr :class, :any, default: "h-6 w-6"

  def spinner(assigns) do
    ~H"""
    <div class={[base_classes() | List.wrap(@class)]} title="loading" aria-live="polite">
      <span class="sr-only">loading</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="currentColor" class="pointer-events-none" aria-hidden="true">
        <path d="M4.54686 32.0766C3.66353 32.5866 2.52629 32.2866 2.09216 31.3637C0.585748 28.161 -0.129671 24.633 0.0193006 21.0787C0.194121 16.9076 1.55213 12.8724 3.93472 9.44429C6.31731 6.0162 9.62611 3.33679 13.4747 1.71901C17.3232 0.101228 21.5526 -0.388132 25.6689 0.308085C29.7852 1.00431 33.6184 2.85736 36.7209 5.65081C39.8233 8.44427 42.0669 12.0628 43.1896 16.0838C44.3123 20.1047 44.2677 24.3621 43.061 28.3587C42.0328 31.7643 40.197 34.8607 37.7211 37.3898C37.0076 38.1187 35.835 38.028 35.1685 37.2558C34.502 36.4837 34.5955 35.3234 35.2966 34.5825C37.2482 32.5202 38.6994 30.0254 39.525 27.2911C40.529 23.9655 40.5661 20.4229 39.6319 17.0771C38.6978 13.7312 36.8309 10.7202 34.2493 8.39577C31.6677 6.07133 28.4781 4.52939 25.0529 3.95007C21.6277 3.37074 18.1084 3.77794 14.906 5.1241C11.7036 6.47027 8.95037 8.69982 6.96781 11.5523C4.98525 14.4049 3.85524 17.7626 3.70977 21.2334C3.59016 24.0871 4.1402 26.9204 5.30501 29.5098C5.72344 30.4401 5.4302 31.5666 4.54686 32.0766Z" />
      </svg>
    </div>
    """
  end

  @double_base_classes "[&>svg]:fill-[--sui-brand-primary] [&_path]:origin-center first:[&_path]:fill-[--sui-brand-primary-shadow] even:[&_path]:animate-spin last:[&_path]:animate-spin-reverse last:[&_path]:fill-[--sui-brand-primary-muted]"
  defp double_base_classes, do: @double_base_classes

  attr :class, :any, default: "h-[114px] w-[114px]"

  def spinner_double(assigns) do
    ~H"""
    <div class={[double_base_classes() | List.wrap(@class)]} title="loading" aria-live="polite">
      <span class="sr-only">loading</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244 244" fill="currentColor" class="pointer-events-none" aria-hidden="true">
        <path d="M244 122C244 189.379 189.379 244 122 244C54.6213 244 0 189.379 0 122C0 54.6213 54.6213 0 122 0C189.379 0 244 54.6213 244 122ZM20.4833 122C20.4833 178.066 65.9339 223.517 122 223.517C178.066 223.517 223.517 178.066 223.517 122C223.517 65.9339 178.066 20.4833 122 20.4833C65.9339 20.4833 20.4833 65.9339 20.4833 122Z" />
        <path d="M218.786 66.1208C223.684 63.2927 229.991 64.9558 232.398 70.0742C240.752 87.8346 244.719 107.399 243.893 127.109C242.924 150.239 235.393 172.617 222.18 191.627C208.968 210.637 190.619 225.496 169.277 234.467C147.935 243.439 124.481 246.152 101.654 242.292C78.8275 238.431 57.5705 228.155 40.3661 212.664C23.1616 197.173 10.7199 177.106 4.49417 154.808C-1.73157 132.51 -1.48433 108.901 5.20701 86.7381C10.9089 67.8525 21.0895 50.6815 34.8193 36.6563C38.7762 32.6143 45.2788 33.1177 48.9748 37.3995C52.6707 41.6813 52.152 48.1157 48.2642 52.2241C37.4417 63.6607 29.3941 77.4954 24.8161 92.6585C19.2482 111.1 19.0425 130.746 24.2229 149.3C29.4034 167.854 39.7562 184.552 54.0721 197.442C68.388 210.332 86.076 218.882 105.07 222.095C124.064 225.308 143.581 223.05 161.339 215.585C179.098 208.119 194.366 195.756 205.36 179.937C216.355 164.118 222.621 145.498 223.428 126.251C224.091 110.426 221.041 94.7142 214.581 80.3545C212.261 75.1961 213.887 68.949 218.786 66.1208Z" />
        <path d="M188.511 83.6C190.041 82.7164 192.005 83.2381 192.826 84.8027C198.582 95.7613 201.723 107.92 201.982 120.325C202.265 133.797 199.139 147.122 192.896 159.064C186.653 171.005 177.495 181.177 166.271 188.634C155.937 195.5 144.16 199.86 131.877 201.388C130.123 201.606 128.574 200.292 128.426 198.531C128.279 196.77 129.588 195.229 131.341 195.005C142.55 193.571 153.293 189.572 162.73 183.303C173.055 176.443 181.481 167.085 187.225 156.099C192.968 145.112 195.843 132.853 195.584 120.459C195.347 109.132 192.498 98.0281 187.279 88.0053C186.463 86.4378 186.98 84.4837 188.511 83.6Z" />
      </svg>
    </div>
    """
  end
end
