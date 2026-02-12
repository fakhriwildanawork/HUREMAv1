# Optimistic Creation Strategy (Instant Navigation & Lazy Hydration)

This document outlines the standard pattern for creating new items in HUREMA to ensure a **Zero-Latency** user experience.

## 1. Philosophy
Traditional creation flows often wait for server responses before navigating to the detail/edit page. This introduces a perceptible delay.

**Optimistic Creation** reverses this:
1.  **Navigate Immediately**: Use a generated ID and a local "Draft" state to switch views instantly (< 10ms).
2.  **Lazy Hydrate**: Once the destination view is mounted, fetch necessary data (like user profiles or defaults) in the background and update the state seamlessly.

## 2. Implementation Steps

### A. List View (Parent) - Example: `EmployeeList.tsx`
*   Generate a UUID locally (`crypto.randomUUID()`).
*   Create a skeleton/draft object with empty or default values.
*   Navigate immediately using `navigate(url, { state: { ... } })`.

```typescript
const handleAdd = () => {
  const id = crypto.randomUUID();
  const newEmployee = { 
    id, 
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0]
  };
  navigate(`/employees/${id}`, { state: { employee: newEmployee, isNew: true } });
};
```

### B. Detail View (Child) - Example: `EmployeeDetail.tsx`
*   Initialize state from `location.state`.
*   Use `useEffect` to check if it's a new item (`isNew` flag) and perform "Lazy Hydration".

```typescript
useEffect(() => {
  const hydrate = async () => {
    if (location.state?.isNew) {
      // Fetch dynamic defaults in background (e.g. current HR staff name)
      // Update state without blocking UI
    }
  };
  hydrate();
}, []);
```

## 3. Benefits
*   **Perceived Performance**: The app feels instantaneous.
*   **User Focus**: Users can start typing information immediately while secondary data loads in background.
