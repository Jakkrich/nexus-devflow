---
description: Test Generation and Execution - Generates missing tests, runs existing test suites, or checks test coverage for the project.
---
# 🧪 Test Generation and Execution

## Usage: `/13-Test [target]`

Generates missing tests, runs existing test suites, or checks test coverage for the project.

---

## 🛠️ Sub-commands

- `/13-Test`                - Run all tests
- `/13-Test [file/feature]` - Generate tests for a specific target
- `/13-Test coverage`       - Show test coverage report
- `/13-Test watch`          - Run tests in watch mode

---

## 🚦 Internal Process

### Scenario A: Generate Tests
If the user requests tests for a target:
1. **Analyze**: Identify functions, edge cases, and external dependencies.
2. **Template Verification**: **MANDATORY:** Before generating the test plan, the agent MUST inspect the layout, required sections, and format defined in `.agent/resources/schemas/test_report.template.md` to ensure a consistent output layout.
3. **Generate Cases**: Develop Happy path, Error cases, Edge cases.
4. **Write**: Implement the tests using the project's testing framework (Pytest, Jest, Vitest, etc.). Follow the `Arrange-Act-Assert` pattern and mock external dependencies.
5. **Save Test Report**: Save the test plan and results to `.workspaces/reports/test_report_{target}.md` (where `{target}` is a slugified version of the file or feature name).

### Scenario B: Execute Tests
Use the project's native command (e.g., `npm test`, `pytest`) to run the tests and format the output clearly for the user. Highlight any failed tests with expected vs received values. Save the execution summary report matching the template to `.workspaces/reports/test_report_run.md`.

---

## 🛡️ Key Principles
- **Test behavior, not implementation.**
- **One assertion per test** (when practical).
- **Descriptive test names.**
- **Arrange-Act-Assert pattern.**
- **Save Report**: Always save the test plan or results to disk for persistent logging.

## 📝 Output Formats

### For Test Generation
Generate a summary indicating:
- **Test Plan**: Table of Test Case, Type, Coverage (Happy path, error case, validation)
- **Generated Tests**: File path and the code block
- **Report Location**: Confirm the report has been written to the specified workspace path.
- **Run command**: e.g. `npm test`

### For Test Execution
Display an organized output listing Passed/Failed files, and explicitly show the expectation vs received outcome for failed assertions.
