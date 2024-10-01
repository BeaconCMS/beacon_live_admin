defmodule Beacon.LiveAdminTest.E2E.Fixtures do
  def scenario("basic") do
    Beacon.Test.Fixtures.published_page_fixture(site: "site_a")
  end

  def scenario("drag_n_drop") do
    Beacon.Loader.reload_live_data_module(:site_a)

    layout = Beacon.Test.Fixtures.published_layout_fixture(site: "site_a", template: "<%= @inner_content %>")

    Beacon.Test.Fixtures.published_page_fixture(
      site: "site_a",
      path: "/drag-n-drop",
      title: "drag-n-drop test",
      layout_id: layout.id,
      template: """
      <!-- 1. Row using Margins -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">1. Row using Margins</h2>
        <div class="flex">
          <div class="mr-4 p-2 border rounded">Item 1<br />Small text.</div>
          <div class="mr-4 p-2 border rounded">Item 2<br />Small text.</div>
          <div class="mr-4 p-2 border rounded">Item 4<br />Small text.</div>
          <div class="mr-4 p-2 border rounded flex-grow">Item 3<br />Wider element text.</div>
          <div class="mr-4 p-2 border rounded">Item 5<br />Small text.</div>
        </div>
      </div>
      <!-- 2. Vertical using Margins -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">2. Vertical using Margins</h2>
        <div>
          <div class="mb-4 p-2 border rounded">Item 1<br />Small text.</div>
          <div class="mb-4 p-2 border rounded">Item 2<br />Small text.</div>
          <div class="mb-4 p-2 border rounded">Item 4<br />Small text.</div>
          <div class="mb-4 p-2 border rounded">Item 3<br />Small text. <br /> But taller</div>
          <div class="mb-4 p-2 border rounded">Item 5<br />Small text.</div>
        </div>
      </div>
      <!-- 3. Row using Flexbox -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">3. Row using Flexbox</h2>
        <div class="flex space-x-4">
          <div class="p-2 border rounded">Item 1<br />Small text.</div>
          <div class="p-2 border rounded">Item 2<br />Small text.</div>
          <div class="p-2 border rounded">Item 4<br />Small text.</div>
          <div class="p-2 border rounded flex-grow">Item 3<br />Wider element text.</div>
          <div class="p-2 border rounded">Item 5<br />Small text.</div>
        </div>
      </div>
      <!-- 4. Vertical using Flexbox -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">4. Vertical using Flexbox</h2>
        <div class="flex flex-col space-y-4">
          <div class="p-2 border rounded">Item 1<br />Small text.</div>
          <div class="p-2 border rounded">Item 2<br />Small text.</div>
          <div class="p-2 border rounded">Item 3<br />Small text. <br /> But taller</div>
          <div class="p-2 border rounded">Item 4<br />Small text.</div>
          <div class="p-2 border rounded">Item 5<br />Small text.</div>
        </div>
      </div>
      <!-- 5. Row using CSS Grid -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">5. Row using CSS Grid (Single Row)</h2>
        <div class="grid grid-cols-6 gap-4">
          <div class="p-2 border rounded">Item 1<br />Small text.</div>
          <div class="p-2 border rounded">Item 2<br />Small text.</div>
          <div class="p-2 border rounded col-span-2">Item 3<br />Wider element text.</div>
          <div class="p-2 border rounded">Item 4<br />Small text.</div>
          <div class="p-2 border rounded">Item 5<br />Small text.</div>
        </div>
      </div>
      <!-- 6. Vertical using CSS Grid -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">6. Vertical using CSS Grid</h2>
        <div class="grid gap-4 grid-rows-6">
          <div class="p-2 border rounded">Item 1<br />Small text.</div>
          <div class="p-2 border rounded">Item 2<br />Small text.</div>
          <div class="p-2 border rounded row-span-2">Item 3<br />Small text. <br /> But taller</div>
          <div class="p-2 border rounded">Item 4<br />Small text.</div>
          <div class="p-2 border rounded">Item 5<br />Small text.</div>
        </div>
      </div>
      <!-- 7. 2x3 Grid of Elements -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">7. 2x3 Grid of Elements</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-2 border rounded">Item 1<br />Small text.</div>
          <div class="p-2 border rounded">Item 2<br />Small text.<br /> But taller</div>
          <div class="p-2 border rounded">Item 3<br />Small text.</div>
          <div class="p-2 border rounded">Item 4<br />Small text.</div>
          <div class="p-2 border rounded">Item 5<br />Small text.</div>
          <div class="p-2 border rounded">Item 6<br />Small text.</div>
        </div>
      </div>
      <!-- 8. Inline-block elements with overflow -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-4">8. Elements with Inline-Block Layout</h2>
        <div class="text-justify">
          <div class="inline-block w-1/3 p-2 border rounded mb-2 mx-2">
            Item 1<br />Small text.
          </div>
          <div class="inline-block w-2/5 p-2 border rounded mb-2 mx-2">
            Item 2<br />Small text.<br />But taller.
          </div>
          <div class="inline-block w-1/4 p-2 border rounded mb-2 mx-2">
            Item 3<br />Small text.
          </div>
          <div class="inline-block w-1/3 p-2 border rounded mb-2 mx-2">
            Item 4<br />Small text.
          </div>
          <div class="inline-block w-1/5 p-2 border rounded mb-2 mx-2">
            Item 5<br />Small text.
          </div>
          <div class="inline-block w-9/20 p-2 border rounded mb-2 mx-2">
            Item 6<br />Small text.
          </div>
        </div>
      </div>
      """
    )
  end
end
