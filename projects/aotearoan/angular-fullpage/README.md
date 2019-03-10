[![npm version](https://badge.fury.io/js/%40aotearoan%2Fangular-fullpage.svg)](https://badge.fury.io/js/%40aotearoan%2Fangular-fullpage)

# Angular Fullpage Scroll

A pure Angular / Typescript component providing vertical responsive full page scrolling sections without the use of JQuery.

## Requirements

* Angular (requires Angular 7.x or higher)
* Supports all major browsers and IE11 and up (lower versions might not be supported)

## Features:
* Full page sections with smooth scrolling navigation.
* Mousewheel, arrow key, space (shift+space) navigation.
* Touch device support (swipe up, swipe down).
* Automatically allows for scrolling within a section when the content is longer than the screen.
* Shorter sections can be specified which fit the content, not the full page height (e.g for a short footer).
* Ability to lock/unlock scrolling dynamically in code.

## Installation

with npm:
```
npm install @aotearoan/angular-fullpage
```

with yarn:
```
yarn add @aotearoan/angular-fullpage
```

## Usage

Import _FullpageModule_ into the corresponding Module
```typescript
import { FullpageModule } from '@aotearoan/angular-fullpage';

@NgModule({
  declarations: [
  ],
  imports: [
    FullpageModule,
  ],
  providers: [],
})
export class SomeModule { }
```

Import _SectionModel_ into the corresponding Component
```typescript
import { SectionModel } from '@aotearoan/angular-fullpage';
```

Create the full page configuration in the corresponding Component
```typescript
  public sections: SectionModel = [
    {url: 'section-a', active: false, pageTop: true},
    {url: 'section-b', active: false},
    {url: 'section-c', active: false},
    {url: 'section-d', active: false},
  ];

  public sectionChange(url: string) {
    // TODO: implement
  }
```
* define _url_ which is both the fullpage section element id and the url fragment set when navigating to a section.
* _active_ is set by the fullpage component when the active section changes
* _sectionChange_ is a callback which will notify you of a section change from within the component by emitting the new url/fragment. This can be useful when implementing a section navigation menu.
* _pageTop_ set this to true for the top page section and navigation will not use the fragment e.g. the url will be / instead of /#section-a

Add the full page component to the template

```html
<ao-fullpage [sections]="sections" (sectionChange)="sectionChange">
</ao-fullpage>
```

Add the page sections to the template by using the class _fullpage-section_ and providing an id defined in the section model (the url in _SectionModel_)
```html
<ao-fullpage [sections]="sections">
  <section class="fullpage-section" [id]="sections[0].url">
    <app-section [section]="sections[0]">
      <h1>A fullpage section</h1>
    </app-section>
  </section>
  <section class="fullpage-section" [id]="sections[1].url">
    <app-section [section]="sections[1]">
      <h1>A fullpage section with an input</h1>
      <form>
        <textarea rows="10" placeholder="Interaction with form controls should prevent keyboard scrolling"></textarea>
      </form>
    </app-section>
  </section>
  <section class="fullpage-section" [id]="sections[2].url">
    <app-section [section]="sections[2]">
      <h1>Another fullpage section</h1>
    </app-section>
  </section>
</ao-fullpage>
```

To make a the final section which is not full height but fits the content (e.g. a page footer), use the class _fullpage-section-fit-content_
```html
  <section class="fullpage-section-fit-content" [id]="sections[3].url">
    <app-section [section]="sections[3]">
      <h1>A shorter fullpage section</h1>
    </app-section>
  </section>
```

## Other options

### lockScrolling
To dynamically lock the scrolling, i.e. prevent scrolling up or down to other sections use the boolean attribute _lockScrolling_
```html
<ao-fullpage [lockScrolling]="true"></ao-fullpage>
```

### scrollSensitivity
When rapidly scrolling with the mouse wheel a large number of events are generated in quick succession. These need to be consumed and discarded (prevent default) in order to ensure the user doesn't scroll through multiple sections at once. This is achieved by measuring the time between events. If this time is greater than the _scrollSensitivity_ it indicates a pause between wheel events, i.e. a new user action. If not then the event is discarded.

This is configurable via the _scrollSensitivity_ attribute. The default value is **75ms** which gives reasonable results, however the value can be adjusted lower to increase sensitivity at the risk of letting through too many scroll events or higher which may result in discarding new genuine user wheel events.
