import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, expect, it, vi } from "vitest";
import { AdminProvider } from "new-api-admin-ui";
import { DemoProvider, DemoControls } from "../../../components/demo-controls";
import { ProjectForm } from "../project-form";
import { FormOverlay } from "../form-overlay";
import { projectService } from "../service";
function Fixture(props: { children: React.ReactNode }) {
  return (
    <AdminProvider language="en">
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
          })
        }
      >
        <DemoProvider>
          <DemoControls />
          {props.children}
        </DemoProvider>
      </QueryClientProvider>
    </AdminProvider>
  );
}
beforeEach(() => projectService.reset());
it("invalid required input prevents save and focuses the invalid field", async () => {
  render(
    <Fixture>
      <ProjectForm />
    </Fixture>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  const name = screen.getByRole("textbox", { name: /Name/ });
  expect(name).toHaveAttribute("aria-invalid", "true");
  await waitFor(() => expect(name).toHaveFocus());
  expect((await projectService.list()).total).toBe(12);
});
it("notification toggle reveals the required email and dynamic rows can be removed", async () => {
  render(
    <Fixture>
      <ProjectForm />
    </Fixture>,
  );
  await userEvent.click(screen.getByRole("tab", { name: "Advanced options" }));
  expect(screen.queryByRole("textbox", { name: /Notification email/ })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));
  expect(screen.getByRole("textbox", { name: /Notification email/ })).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "Add milestone" }));
  expect(screen.getAllByRole("textbox", { name: /Milestone/ })).toHaveLength(2);
  await userEvent.click(screen.getAllByRole("button", { name: "Remove milestone" })[1]);
  expect(screen.getAllByRole("textbox", { name: /Milestone/ })).toHaveLength(1);
});
it("save failures keep entered values and show the error", async () => {
  render(
    <Fixture>
      <ProjectForm />
    </Fixture>,
  );
  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), "Keep my input");
  await userEvent.selectOptions(screen.getByLabelText("Preview state"), "submit-error");
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(await screen.findByText("Save failed. Your changes are preserved.")).toBeVisible();
  expect(screen.getByRole("textbox", { name: /Name/ })).toHaveValue("Keep my input");
  expect((await projectService.list()).total).toBe(12);
});
it("a dirty dialog requires confirmation before discarding input", async () => {
  const close = vi.fn();
  render(
    <Fixture>
      <FormOverlay variant="dialog" onClose={close} />
    </Fixture>,
  );
  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), "Draft value");
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.getByRole("alertdialog")).toBeVisible();
  expect(close).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(close).toHaveBeenCalledOnce();
});
it("saving a new record twice updates the first record instead of creating a duplicate", async () => {
  render(
    <Fixture>
      <ProjectForm />
    </Fixture>,
  );
  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), "First name");
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(async () => expect((await projectService.list()).total).toBe(13));
  await userEvent.clear(screen.getByRole("textbox", { name: /Name/ }));
  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), "Second name");
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(async () =>
    expect((await projectService.list({ search: "Second name" })).total).toBe(1),
  );
  expect((await projectService.list()).total).toBe(13);
});

it("drawer section completion follows values and validation errors", async () => {
  render(
    <Fixture>
      <FormOverlay variant="drawer" onClose={() => {}} />
    </Fixture>,
  );
  expect(screen.getByRole("navigation", { name: "Form sections" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Basic information: Incomplete" })).toBeVisible();
  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), "Complete section");
  expect(screen.getByRole("button", { name: "Basic information: Completed" })).toBeVisible();
  expect(screen.getByText("4 of 4 sections complete")).toBeVisible();
  await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));
  expect(
    screen.getByRole("button", { name: "Scheduling and notifications: Incomplete" }),
  ).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(screen.getByRole("button", { name: "Scheduling and notifications: Error" })).toBeVisible();
  const email = screen.getByRole("textbox", { name: /Notification email/ });
  await waitFor(() => expect(email).toHaveFocus());
  await userEvent.type(email, "demo@example.com");
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Scheduling and notifications: Completed" }),
    ).toBeVisible(),
  );
});
