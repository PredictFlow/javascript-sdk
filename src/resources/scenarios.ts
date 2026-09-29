import { BaseResource } from '../core/base-resource';
import { QueryParams } from '../core/request-builder';
import {
  Scenario,
  ScenarioCreateInput,
  ScenarioUpdateInput,
  ScenarioCloneInput,
  ScenarioResult,
  ScenarioComparison,
  ScenarioCompareParams,
} from '../types/scenarios.types';

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
  async execute(scenarioId: string): Promise<ScenarioResult> {
    return this.http.post<ScenarioResult>(`/scenarios/${scenarioId}/execute`);
  }

  /**
   * Clone an existing scenario with new parameters or custom name.
   */
  async clone(scenarioId: string, data: ScenarioCloneInput = {}): Promise<Scenario> {
    return this.http.post<Scenario>(`/scenarios/${scenarioId}/clone`, data);
  }

  /**
   * Compare two scenarios side-by-side.
   */
  async compare(storeId: string, params: ScenarioCompareParams): Promise<ScenarioComparison> {
    return this.http.get<ScenarioComparison>(`/stores/${storeId}/scenarios/compare`, {
      query: params as unknown as QueryParams,
    });
  }

  /**
   * Delete a scenario.
   */
  async delete(scenarioId: string): Promise<void> {
    return this.http.delete<void>(`/scenarios/${scenarioId}`);
  }
}
