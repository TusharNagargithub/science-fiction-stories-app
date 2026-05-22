import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoryListItem, StoryStatus } from '../../models/story.model';
import { imageUrl } from '../../core/image.util';
import { StoryService } from '../../services/story.service';

type FilterKey = 'all' | 'new' | 'in-progress' | 'completed';

@Component({
  selector: 'app-stories-list',
  templateUrl: './stories-list.component.html',
  styleUrl: './stories-list.component.scss',
})
export class StoriesListComponent implements OnInit {
  stories: StoryListItem[] = [];
  filteredStories: StoryListItem[] = [];
  loading = true;
  error = '';

  activeFilter: FilterKey = 'all';
  pageSize = 12;
  currentPage = 1;

  readonly filters: { key: FilterKey; label: string; className: string }[] = [
    { key: 'new', label: 'New', className: 'filter-new' },
    { key: 'in-progress', label: 'In Progress', className: 'filter-progress' },
    { key: 'completed', label: 'Completed', className: 'filter-completed' },
    { key: 'all', label: 'Clear All', className: 'filter-clear' },
  ];

  constructor(
    private readonly storyService: StoryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.storyService.getStories().subscribe({
      next: (stories) => {
        this.stories = stories;
        this.applyFilter(this.activeFilter);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load stories. Please try again later.';
        this.loading = false;
      },
    });
  }

  get paginatedStories(): StoryListItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStories.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredStories.length / this.pageSize));
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  imageUrl = imageUrl;

  setFilter(filter: FilterKey): void {
    this.applyFilter(filter);
    this.currentPage = 1;
  }

  openStory(story: StoryListItem): void {
    this.router.navigate(['/story', story.id]);
  }

  previousPage(): void {
    if (this.canGoPrevious) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.canGoNext) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  statusClass(status: StoryStatus): string {
    const value = status.toLowerCase();
    if (value.includes('progress')) {
      return 'status-progress';
    }
    if (value.includes('complete')) {
      return 'status-completed';
    }
    return 'status-new';
  }

  private applyFilter(filter: FilterKey): void {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredStories = [...this.stories];
      return;
    }

    const target = this.filterToStatus(filter);
    this.filteredStories = this.stories.filter((story) => story.status === target);
  }

  private filterToStatus(filter: FilterKey): StoryStatus {
    switch (filter) {
      case 'new':
        return 'New';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'New';
    }
  }
}
