import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

function animationQuery(target: string, fromTranslation: string, toTranslation: string) {
  return query(target, [
    style({ transform: fromTranslation }),
    animate('.3s ease-in-out', style({ transform: toTranslation })),
    animateChild(),
  ], { optional: true });
}

function initialStyles() {
  return query(':enter, :leave', [
    style({
      position: 'absolute',
      top: 0,
      height: '100vh',
    }),
  ]);
}

function up() {
  return [
    initialStyles(),
    group([
      animationQuery(':leave', 'translateY(0vh)', 'translateY(100vh)'),
      animationQuery(':enter', 'translateY(-100vh)', 'translateY(0vh)'),
    ]),
  ];
}

function down() {
  return [
    initialStyles(),
    group([
      animationQuery(':leave', 'translateY(0vh)', 'translateY(-100vh)'),
      animationQuery(':enter', 'translateY(100vh)', 'translateY(0vh)'),
    ]),
  ];
}

export const slideAnimation = trigger('routeAnimations', [
  transition('* => 0', up()),
  transition('0 => *', down()),
  transition('1 => 0', up()),
  transition('1 => *', down()),
  transition('2 => 0', up()),
  transition('2 => 1', up()),
  transition('2 => *', down()),
  transition('3 => 0', up()),
  transition('3 => 1', up()),
  transition('3 => 2', up()),
  transition('3 => *', down()),
  transition('4 => 0', up()),
  transition('4 => 1', up()),
  transition('4 => 2', up()),
  transition('4 => 3', up()),
  transition('4 => *', down()),
  transition('5 => 7', down()),
  transition('5 => 6', down()),
  transition('5 => *', up()),
  transition('6 => 7', down()),
  transition('6 => *', up()),
  transition('7 => *', up()),
]);
