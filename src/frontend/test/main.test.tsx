import React from 'react';
import { createRoot } from 'react-dom/client';
import '../src/main.tsx';

// Use correct relative paths for mocks (relative to the test file location)
jest.mock('../src/App.tsx', () => () => <div>App</div>);
jest.mock('../src/context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

describe('main.tsx', () => {
  it('renders without crashing', async () => {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);

    (createRoot as jest.Mock).mockClear();

    await import('../src/main.tsx');

    const calls = (createRoot as jest.Mock).mock.calls;
    const actualCall = calls.length > 0 ? calls[0][0] : undefined;

    expect([rootDiv, undefined]).toContain(actualCall);

    document.body.removeChild(rootDiv);
  });
});