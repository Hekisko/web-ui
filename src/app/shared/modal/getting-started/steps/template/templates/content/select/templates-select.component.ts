/*
 * Lumeer: Modern Data Definition and Processing Platform
 *
 * Copyright (C) since 2017 Lumeer.io, s.r.o. and/or its affiliates.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output, signal,
  SimpleChanges, WritableSignal
} from '@angular/core';

import {removeAccentFromString} from '@lumeer/utils';

import {Project} from '../../../../../../../../core/store/projects/project';
import {BehaviorSubject} from "rxjs";
import {$localize} from "@angular/localize/init";
import {AiService} from "../../../../../../../../core/ai/ai.service";
import {AiTemplateSuggestionResponse} from "../../../../../../../../core/model/ai-template-suggestions";
@Component({
  selector: 'templates-select',
  templateUrl: './templates-select.component.html',
  styleUrls: ['./templates-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesSelectComponent implements OnChanges {
  @Input()
  public templates: Project[];

  @Input()
  public selectedTag: string;

  @Input()
  public selectedTemplate: Project;

  @Output()
  public selectTemplate = new EventEmitter<Project>();

  public tagImageUrl: string;

  public aiSelectedTemplates$: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  public projectDescription$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public projectDescription: string;

  public errorMessage$ = new BehaviorSubject<string>("");

  public aiTemplateSuggestions: WritableSignal<AiTemplateSuggestionResponse | null>;

  constructor(
    private aiService: AiService
  ) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedTag.currentValue === "AI") {
      this.aiSelectedTemplates$.next([...this.templates]);
      return;
    }
    if (changes.selectedTag) {
      this.tagImageUrl = this.createTagImageUrl();
    }
  }

  private createTagImageUrl(): string {
    const tagWithoutAccent = removeAccentFromString(this.selectedTag).replace(/ /g, '_');
    return `https://www.lumeer.io/wp-content/uploads/lumeer-projects/${tagWithoutAccent}.jpg`;
  }

  public aiProjectDescriptionPlaceHolder() {
    return $localize`:@@ai.create.table.modal.input.placeholder:Describe your project`;
  }

  public onInputChanged(value: any) {
    this.projectDescription = value;
    this.projectDescription$.next(value);
  }

  public updateTemplateByAi() {
    this.errorMessage$.next("");
    this.projectDescription$.next("");
    this.aiService.templateSuggestions$ = signal(null);
    this.aiTemplateSuggestions = this.aiService.templateSuggestions$;
    this.aiService.fetchTemplateSuggestions(
      {
        projectDescription: this.projectDescription
      }
    );
  }

  public onTemplateSuggestionsReceived(data: any): boolean {

    if (data === undefined) {
      return false;
    } else if (data() === null) {
      return true;
    } else {

      this.projectDescription$.next(this.projectDescription);
      this.errorMessage$.next("");
      this.aiTemplateSuggestions = undefined;

      if (data().length == 0 || data()["error"]) {
        this.errorMessage$.next(data()["errorMessage"]);
        return false;
      }

      this.aiSelectedTemplates$.next(
        this.templates.filter(
          template =>
            data()["bestMatchTemplates"].includes(template.name)
        )
      );
      return false;
    }
  }
}
