import './dropdown-menu.css';

type DropdownMenuParams<T> = {
  element: HTMLDivElement;
  input: HTMLInputElement;
  data: T[];
  count?: number;
  labelBy?: keyof T;
  renderItem?: (fn: T) => string;
  onClick?: (event: Event) => void; // Update the type of onClick callback
};

export const dropdownMenu = <T>({
  element,
  input,
  data,
  count,
  labelBy = <keyof T>'name',
  renderItem,
  onClick,
}: DropdownMenuParams<T>) => {
  if (!data) {
    element.innerHTML = `
      <div class="dropdown">
        <div class="dropdown__link dropdown_inactive">No results found</div>
      </div>
    `;
    return;
  }

  if (data && count && data.length > count) {
    data = data.slice(0, count);
  }

  if (renderItem) {
    const dropdownEl = document.createElement('div');
    dropdownEl.classList.add('dropdown');

    data.forEach((item) => {
      const doc = new DOMParser().parseFromString(
        renderItem(item),
        'text/html'
      );
      const node = doc.body.firstChild;
      if (!node) {
        return;
      }
      node.addEventListener('click', (event) => {
        if (onClick) {
          onClick(event);
        }
      });
      dropdownEl.appendChild(node as Node);
    });
    element.innerHTML = '';
    element.appendChild(dropdownEl);
  } else {
    element.innerHTML = `
    <div class="dropdown">
      ${data
        .map(
          (item) =>
            `
        <div class="dropdown__link">${item[labelBy]}</div>
        `
        )
        .join('')}
    </div>
  `;
  }

  document.addEventListener('click', (event) => {
    if (input !== event.target) {
      element.remove();
    }
  });
};
