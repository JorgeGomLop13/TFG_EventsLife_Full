import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  //Animacion desde home hasta profile
  transition('HomePage => ProfilePage', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '100%', opacity: 0 })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('300ms ease-in-out', style({ left: '-100%', opacity: 0 }))], { optional: true }),
      query(':enter', [animate('300ms ease-in-out', style({ left: '0%', opacity: 1 }))], { optional: true })
    ]),
    query('@*', animateChild(), { optional: true })
  ]),
  //Animacion desde profile hasta home
  transition('ProfilePage => HomePage', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          width: '100%'
        })
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '-100%', opacity: 0 })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('300ms ease-in-out', style({ left: '100%', opacity: 0 }))], { optional: true }),
      query(':enter', [animate('300ms ease-in-out', style({ left: '0%', opacity: 1 }))], { optional: true })
    ]),
    query('@*', animateChild(), { optional: true })
  ]),
  // Animación por defecto
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          width: '100%',
          top: 0
        })
      ],
      { optional: true }
    ),
    query(':enter', [style({ opacity: 0, transform: 'translateY(20px)' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', [animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))], { optional: true }),
      query(':enter', [animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], { optional: true })
    ]),
    query('@*', animateChild(), { optional: true })
  ])
]);
