// Mock <dialog> and showModal for jsdom
beforeAll(() => {
  if (!window.HTMLDialogElement) {
    // @ts-ignore
    window.HTMLDialogElement = class {};
  }
  if (!HTMLDialogElement.prototype.showModal) {
    // @ts-ignore
    HTMLDialogElement.prototype.showModal = function () {};
  }
  if (!HTMLDialogElement.prototype.close) {
    // @ts-ignore
    HTMLDialogElement.prototype.close = function () {};
  }
});

import { render, fireEvent, screen } from '@testing-library/react';
import DeleteConfirmation from '../../../src/components/DeleteConfirmation/DeleteConfirmation';

// Mock CSS import for Jest
jest.mock('../../../src/components/DeleteConfirmation/DeleteConfirmation.css', () => ({}));

describe('<DeleteConfirmation />', () => {
  it('renders confirmation text and handles confirm/cancel', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <DeleteConfirmation
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmationText="Regelmäßigen Service wirklich löschen?"
      />
    );

    // Dialog should show the confirmation text
    expect(screen.getByText(/wirklich löschen/i)).toBeTruthy();

    // Confirm button should call onConfirm
    const confirmButton = screen.getAllByText(/Löschen/i).find(
      el => el.tagName === 'BUTTON'
    );
    fireEvent.click(confirmButton!);
    expect(onConfirm).toHaveBeenCalled();

    // Cancel button should call onCancel
    fireEvent.click(screen.getByText(/Abbrechen/i));
    expect(onCancel).toHaveBeenCalled();
  });
});
