import { BaseResource } from '../core/base-resource';
import {
  Scenario,
  ScenarioCreateInput,
  ScenarioUpdateInput,
  ScenarioComparison,
} from '../types/scenarios.types';
import { MessageResponse } from '../types/common';

export class ScenariosResource extends BaseResource {
  /**
   * List all scenarios for a store.
   */
  async list(storeId: string): Promise<Scenario[]> {
    return this.http.get<Scenario[]>(`/stores/${storeId}/scenarios`);
  }

  /**
   * Get scenario details by scenario ID.
   */
  async get(storeId: string, scenarioId: string): Promise<Scenario> {
    return this.http.get<Scenario>(`/stores/${storeId}/scenarios/${scenarioId}`);
  }

  /**
   * Create a new what-if simulation scenario.
   */
  async create(storeId: string, data: ScenarioCreateInput): Promise<Scenario> {
    return this.http.post<Scenario>(`/stores/${storeId}/scenarios`, data);
  }

  /**
   * Update scenario parameters.
   */
  async update(scenarioId: string, data: ScenarioUpdateInput): Promise<Scenario> {
    return this.http.patch<Scenario>(`/scenarios/${scenarioId}`, data);
  }

  /**
   * Run/execute simulation calculations for a scenario.
   */
  async execute(scenarioId: string): Promise<Scenario> {
    return this.http.post<Scenario>(`/scenarios/${scenarioId}/execute`);
  }

  /**
   * Clone an existing scenario with new parameters.
   */
  async clone(scenarioId: string, options?: { new_name?: string }): Promise<Scenario> {
    return this.http.post<Scenario>(`/scenarios/${scenarioId}/clone`, options);
  }

  /**
   * Compare multiple scenarios side-by-side.
   */
  async compare(storeId: string, scenarioIds: string[]): Promise<ScenarioComparison> {
    return this.http.get<ScenarioComparison>(`/stores/${storeId}/scenarios/compare`, {
      query: { scenario_ids: scenarioIds },
    });
  }

  /**
   * Delete a scenario.
   */
  async delete(scenarioId: string): Promise<MessageResponse> {
    return this.http.delete<MessageResponse>(`/scenarios/${scenarioId}`);
  }
}
