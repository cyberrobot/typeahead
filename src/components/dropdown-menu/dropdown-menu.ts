import './dropdown-menu.css';

type DropdownMenuParams<T> = {
  element: HTMLDivElement;
  input: HTMLInputElement;
  data: T[];
  count?: number;
  labelBy?: keyof T;
};

export const dropdownMenu = <T>({
  element,
  input,
  data,
  count,
  labelBy = <keyof T>'name',
}: DropdownMenuParams<T>) => {
  if (count) {
    data = data.slice(0, count);
  }

  document.addEventListener('click', (event) => {
    if (!element.contains(event.target as Node) && input !== event.target) {
      element.remove();
    }
  });

  element.innerHTML = `
    <div class="dropdown">
      ${data
        .map(
          (item) => `
            <div class="dropdown__link">${item[labelBy]}</div>
        `
        )
        .join('')}
    </div>
  `;
};
