import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Patient } from '../../data/patients';
import { patientDetailPath, patientSchedulePath } from '../../config/detailRoutes';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
const phoneIcon = 'assets/icons/phone-fill.svg';
const calendarIcon = 'assets/icons/calendar-todo-line.svg';
const arrowIcon = 'assets/icons/arrow-right-s-line.svg';
const verifiedIcon = 'assets/icons/verified-fill.svg';
const glowIcon = 'assets/icons/ellipse-glow.svg';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  template: `
    <article class="card" [attr.data-figma-node-id]="patient.nodeId">
      <div class="top" [attr.data-figma-node-id]="patient.topNodeId">
        <div class="titleRow">
          <div class="nameBlock">
            <h3 class="name">{{ patient.name }}</h3>
            <p class="campSubtitle">
              <span class="campRef">{{ patient.campRef }}</span>
              <span class="separator">·</span>
              <span class="campName">{{ patient.campName }}</span>
            </p>
          </div>
          <span class="number">{{ patient.patientNumber }}</span>
        </div>
        <div class="meta">
          <app-status-badge
            [status]="patient.status"
            [dotIcon]="patient.dotIcon"
            [nodeId]="patient.statusNodeId"
          />
          <span class="separator">·</span>
          <span class="metaMuted">{{ patient.age }} yrs</span>
          <span class="separator">·</span>
          <span class="metaMuted">{{ patient.gender }}</span>
        </div>
      </div>

      @if (patient.conditions) {
        <div class="divider" role="separator"></div>
        <p class="conditions" [attr.data-figma-node-id]="patient.conditionsNodeId">
          {{ patient.conditions }}
        </p>
      }

      <div class="divider" role="separator"></div>
      <div class="bottom" [attr.data-figma-node-id]="patient.bottomNodeId">
        <img [src]="glowIcon" alt="" class="glow" aria-hidden="true" />
        <div class="bottomRow">
          <div class="phoneRow">
            <div class="phoneBadge" [attr.data-figma-node-id]="patient.phoneNodeId" data-name="Status Badge">
              <img [src]="phoneIcon" alt="" class="phoneIcon" width="16" height="16" />
              <span class="phoneNumber">{{ patient.phone }}</span>
            </div>
            @if (!isVerified && showVerify) {
              <button
                type="button"
                class="verifyBtn"
                [attr.data-figma-node-id]="patient.verifyNodeId"
                data-name="Button"
                (click)="verifyClick.emit($event)"
              >
                Verify Now
              </button>
            }
            @if (isVerified) {
              <span
                class="verifiedBadge"
                [attr.data-figma-node-id]="patient.verifiedBadgeNodeId"
                data-name="Button"
                aria-label="Phone verified"
              >
                <img [src]="verifiedIcon" alt="" class="verifiedIcon" width="20" height="20" />
              </span>
            }
          </div>
          <div class="actions">
            <a
              [routerLink]="schedulePath"
              class="actionBtn"
              [attr.data-figma-node-id]="patient.calendarNodeId"
              data-name="Button"
              [attr.aria-label]="'Schedule for ' + patient.name"
            >
              <span [class]="isVerified ? 'calendarInnerVerified' : 'calendarInner'">
                <img [src]="calendarIcon" alt="" class="actionIcon" width="20" height="20" />
              </span>
            </a>
            <a
              [routerLink]="detailPath"
              class="actionBtn"
              [attr.data-figma-node-id]="patient.arrowNodeId"
              data-name="Button"
              [attr.aria-label]="'View ' + patient.name"
            >
              <span class="arrowInner">
                <img [src]="arrowIcon" alt="" class="actionIcon" width="20" height="20" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  `,
  styleUrl: './PatientCard.module.css',
})
export class PatientCardComponent {
  @Input({ required: true }) patient!: Patient;
  @Input() phoneVerified = false;
  @Input() showVerify = true;
  @Output() verifyClick = new EventEmitter<Event>();

  protected readonly phoneIcon = phoneIcon;
  protected readonly calendarIcon = calendarIcon;
  protected readonly arrowIcon = arrowIcon;
  protected readonly verifiedIcon = verifiedIcon;
  protected readonly glowIcon = glowIcon;

  readonly detailPath = patientDetailPath();
  readonly schedulePath = patientSchedulePath();

  get isVerified(): boolean {
    return this.phoneVerified || this.patient.phoneVerified === true;
  }
}
