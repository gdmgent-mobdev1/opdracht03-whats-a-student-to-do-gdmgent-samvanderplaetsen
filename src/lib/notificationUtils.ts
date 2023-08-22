export function displayNotification(message: string, type: 'success' | 'error' = 'success'): void {
  const notificationContainer = document.getElementById('notificationContainer');

  if (notificationContainer) {
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${type}`;
    notificationElement.textContent = message;

    notificationContainer.appendChild(notificationElement);

    // Automatically remove the notification after a certain time (e.g., 5 seconds)
    setTimeout(() => {
      notificationElement.remove();
    }, 2500);
  }
}
