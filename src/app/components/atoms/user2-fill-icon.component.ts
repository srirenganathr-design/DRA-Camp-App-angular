import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user2-fill-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14.8 18.4744V25.6H17.2V18.4744C21.9352 19.0648 25.6 23.104 25.6 28H6.4C6.40004 25.6617 7.25342 23.4037 8.8 21.6499C10.3466 19.8961 12.48 18.7669 14.8 18.4744V18.4744ZM16 17.2C12.022 17.2 8.8 13.978 8.8 10C8.8 6.022 12.022 2.8 16 2.8C19.978 2.8 23.2 6.022 23.2 10C23.2 13.978 19.978 17.2 16 17.2Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class User2FillIconComponent {
  @Input() size = 32;
}
