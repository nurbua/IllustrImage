import React, { useState, useCallback, useEffect } from 'react';
import { PoemType } from './types';
import { POEM_TYPES } from './constants';
import { generatePoemFromImage, generateQuotesFromImage, generateTitleFromImage, generateCaptionFromImage } from './services/geminiService';

const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAA1wSURBVHja7J15nFzV+8/PvdvMTG9mPknmk0xCEsmsCSQhAQkBYSCQYwJzwDkYj8fj2Xv23ntv2Zt9fE0YCDkGZ8GBA3sDkkBCSDYhk8xMMm9m+vP7o6q7p5uZXtK7p/v9fF6e6q6qrp6+66v+9a5fvWsdhBAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRA-axw, -axwB1wBuAI4AzgD+AN4APgA+A94DHgCOAc4ADgE+Ad4A3gA+A14ADgPOAM4BjgD+ALwFvAD8DHgAOA84ADgGuAN4AfgA+A94ADgPOAc4AzgAOAc4CvgNeAF4CvgA+A14CngAOAc4CvgA8BbwBfAYcAZwAHAC8ATwA3AB8BjwGPAF8BjwBfAD8DHgMOAE4BvgA+A94ADgIOA84AfgFeAN4CfgNeAA4AzgKOAM4CzgDOAc4CzgHOAM4A3gD+AL4CvgA+A14C3gA+Ax4ADgIOAc4AfgE8A3wFPAA8BjwBvAF8BbwCfAV8BvwC+Az4DjgAOAc4AngDOAc4ATgHOAE4AzgDuAD4DXgA+A34DHgMOAM4BjgD+AN4A3gC+AD4DXgM+A/wAHAMcAZwAPALcANwAvgM+Az4D3gA+Ax4ADgDuAN4AfgM+Ax4AfgFeAM4AjgDOAM4AjgD+AF4A3gC+Aj4DXgM+A94ADgIOAE4AjgBuAG4A3gA+A94AfgFeAN4CvgM+A94ADgIOAM4AjgBuAM4A3gBeA94APgN+Al4A3gNuAM4AjgBuAG4A3gCeAH4DXgL+ADgBjgDuAN4A3gA+Ax4ADgNeAM4ATgCOAM4AngD+AB4AfgM+At4AvgM+A94ADgBOAM4AfgNuAN4C3gA8ADgHOAM4A3gA+A94C3gA+Ax4CDgFuAN4AXgM+Ax4AfgLeAN4C3gA+A/wAvgO8ATwB/AI8ATwBPAE8AXwBPAI8AXwD+APwD/APwD/AF4A/gL8BfwC/A34A/gA+AdwA3gN+A94AfgD+AN4C3gL+A34D3gA+AN4DbgBOAuwD3D7APwP8X4A/g3f/h42/jTz9uP3v+/n7+8ffxP/D/Bfgf8B7wHvAecB7wHHAEcARwBHAEcARwDnAHcA/w+j/APcAfwA+AR4CHgLeAz4B3gNuAN4AfgM+AdwA3AAcB5wAHAFcA5wBnAHcAjwDPAI8CzwH3AD8ADwGPAZ8BjwEPAQcBJwBHAGcAjwHPAI8DzwGPAZ8BjwGPAA8ADwGPAF8ATwCfAJ8A3wCvAF8BPgJ+Ar4CngKeAvwA/AD4Cfgb8DPgZ8DPwE/AT8BbwFvAW8BbwH/A/wC/AP8A/wA/AD8BPwJ+Aj4CfgI+Al4CngAOAo4A3gCeAI4ADgKOAM4ADgIuANcBNwA3ADeA68D1wGvAW8BbwGvAa8CrwGvA+8DrwGvA68DrwBvA68DrwDvA68BbwGvAa8BbwFvAG8B7wLvA28DrwOvAdcD1wGvAe8CrwKvA28BbwOvAa8A7wNvAdcB1wPXA68A7wBvAW8DbgNvAq8DrwOvA24DbwNvAa8ArgCuAFcAVwKvAK4DbgNvAm4CbwFvA68DrwOvAG4DbgFvAG8DbgDcA5wBvAG4CbgNvAu8CrwOvAW8AbwFvAm8DbgFuAW4AbgF+AO4APgIeAg4B7gD+AF4A3gB+Ax4C7gDuAD4CHgKOAE4ArgBeAN4AfgP+AjgDuAN4A/gA+Ax4CDgKOAE4AngC+AB4CHgLOAc4A3gD+AA4CDgIOAD4CfgDuAP4BPAJ4AHgIeAc4AngC+A54BHgIOAs4BzgCeAB4CfgJeAo4AngD+AA4CDgJOAE4AngD+AR4CfgLeAu4C7gJeAt4CHgLeAg4CDgCOAE4A3gD+AA4CDgIOAc4A3gA+AR4CHgIuAu4CXgKOAF4AXgD+A54CXgBuAK4A3gBuAH4C3gAOAi4B7gBeANwA3AA8BDwEHADcB5wA3AOcBNwH3ADcBZwBvAH8BbwH/AH8AfgH+AP4CfgJ+A34CfgJ+An4CvgI+Ah4CXgIeA54CngCeAR4CnAKcAhwCPAA8BTwEvAW8D7wNvA28BbwN+Av4C/gI+Ah4C3gJuAu4AngI8BDwFPAI8BDwGPAa8CrwH/gD/A38BfwD/B38A/wb/A/8B/wH/AP8AfwD+AP4A/gD+APwAfAR8BbwEvAW8BbwFvA+8DbwP/gX+D/4H/gX+D/4G/wb/Bv8B/wBvAm8BbwJuA68CbgNuAW4AbwFvAm4DrwFtAG8AbwBvAm4BbwJuA24A7gGvAG8BbQCvA68DrwJuAW4ArwBuAW4DbgBuAm4CbgGuA68CbgNuAm4DbwCvAK8BrgFuAW4BbgNvAG8BbwG2AG8BbgNvAG8DrwNuAW4AbwFtAG8AbwFtAK4BbQCvAG8AbwBuA68CbgNuAm4DbwFvAm4DbwNuA24DbwNuAW4CbgNsANwBnADcBZwDHACcBZwDHADcBZwCnAIcA5wDHAKeAE4AzgGOAE4CDgHOA68BbQCvAG8CrgG2ACcB1wF1ACeAq4C6gBXA2oBWgFeANwG1gG2AWoDXA64BbQCuAm4CbgG2A2oBbgFuAGoDXAO4B7gG+BvwF/AY8BjgFuAG4AbgFuAG4AbgEeAR4CHgJeAm4CbgJuAu4CXgIeAj4CvgI+Aj4CHgL+Av4AvgE+Av4C/AL8BvwGvAu8D7wOvAe8AbwBvAW8BbgJvAW4AbwNuAm4DrwJuAW4DbgJvAq4BrgJuAW4DbgNuA24CbgNuAW4AbgNvAG8A7gDuAm4CbgFuAW4AbgFuAW4BrgBuAW4CbgG2A68BbQCvA68BbgJvAW4DbgFvAW4AbgNuAm4B1gFuAW4AbwFsANwC3AGsAbwNuA24DbwFuAW4AbwG2A24DbwNuA6wAbwJuA24BbgFuA24AbwFsA1wA3ADeA64AbgNuAm4CbgGuA24DbACeANwB3ACeANwCnACcAhwAnAEcA5wCnACcAZwCnAOcA5wBHAOcA5wCHAEcA5wCHACcARwAnAEcAZwAHADcB5wAHAEcAJwDHADcAJwBHAGcBZwAHAGcARwD3AAcBZwC3AAcBZwBnAAcBZwBnACcARwDnAKeARwCnAKcAhwCPAE8BDwGPAK8CXwD/A+gGkA2AGvAOcAZwCHACcBZwBHADcAJwB3AOcAhwCPAE8BTwE3AScB9wHPAI8BjwBvAK8ArgBuAG4B7gFuAG4C7gHuAN4A3gD+APwFfAT8BfwD/AP8A/wA/AT8BfwD/AP8BfwGfAX8BvwD/AP8B/wF/AX4BfgF+A/4CvgI+Ah4C3gI+Ah4CHgKOAM4AngCeARwCnAKcA5wBHAOcAZwDHAOcA5wBHAOcA5wCHAOcA5wCHAKcAhwCnAIcApwCHAOcA5wBHAOcA5wBHAOcAZwBnAOcAZwBHAOcAZwB3AHcBZwBnAOcA9wDHAHcAZwBHAOcAZwD3AGcAxwB3AOcARwB3AHcB9wBHAO8DfwHfAb8B3wH/Bv8B7wGvAe8BfwD/AP8AfgD+AH4BvwB/AX4C/gI+Ah4CHgLeA/4DfgP+A74DfgP+A/4H/ga+B/4DfgP+A/4D/gP+A/4DfgP+A/4DvgP+B/4D/gL+Av4D/gA+A34D/gA+BvwB/AP4A/gL+AP4D/gA+A/wFfAX8B3wG/Ab8B/wFfAb8B/wH/AP4C/AX4D/gI+Av4CfgN+A/wGfAb8BPwD+A/wAvgA+AP4A3gD+A34CfgL+AP4A/gD+AP4AvgF+A/wA/gP+Av4AvgL+AP4AvgE+AP4DvgD+AP4BPgN+An4C/gN+APwF/AV8B/wFfAX8AfgP+BPwF/AP4DfgH8AfwF/AX4DfgN+A/4DfgH8BvwH/AX8BvwH/AV8BPwF/Af8B/wD/AV8BnwHfAP8BPwH/Ab8CfgL+Av4A/AP4DPgL+An4CfgL+AP4CvgH+An4DfgN+A/wA/gJ+A/wC/gH+A3wC/gL+AX4DfgH+An4DfgP+An4C/AP4CvgH+Av4DfgJ+BvwB/AP4BPgN+BvwF/Af8BPwD/AF8BvwG/APwF/Af4DfgP+AX4D/AF8BnwG/AH8AvgH+AnwC/AH4C/AH8BfgL8BfgN+BfwG/AvwB/An8BvgJ+AXwBfAXwG/AH4AvgF/Av4C/AX4A/gF+A/4A/AL8CfgP+APwG/AH8A/wB/A/4AvgH+AvwD+APwC/An4B/AH8CfgL+APwG/An4B/AL8BPwD+APwC/AfwA/gL8BfwF+AfwBfAP4CfgP+AvwD+An4C/AH8BfgP+Av4CfgH+AvwB/An4BfAnwA/gF8CfgH+BfwD+BvgP+AfwGfAHwGfAn8B/AnwH/AX4C/CXwD/AH8F/AH4S/h//z/3F0CIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIg-CIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgC"

const PhotoIcon = () => (
  <svg xmlns="http://www.w.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v2.586l1.707-1.707a1 1 0 011.414 1.414L12.414 8H15a1 1 0 110 2h-2.586l1.707 1.707a1 1 0 01-1.414 1.414L11 11.414V14a1 1 0 11-2 0v-2.586l-1.707 1.707a1 1 0 01-1.414-1.414L7.586 10H5a1 1 0 110-2h2.586L5.793 6.293a1 1 0 011.414-1.414L9 6.586V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const QuoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.757 1.628l-3.235 4.852A1 1 0 006 10h3a1 1 0 110 2H6a3 3 0 01-2.829-4.148l3.235-4.852a1 1 0 011.837-.122zM15.243 3.03a1 1 0 01.757 1.628l-3.235 4.852A1 1 0 0012 10h3a1 1 0 110 2h-3a3 3 0 01-2.829-4.148l3.235-4.852a1 1 0 011.837-.122z" clipRule="evenodd" />
    </svg>
);

const TitleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.25 3a.75.75 0 01.75.75v.25h1.25a.75.75 0 010 1.5H9.75v10.5h.75a.75.75 0 010 1.5H7.5a.75.75 0 010-1.5h.75V5.5H7a.75.75 0 010-1.5h1.25V3.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

const CaptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 6a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm1 5a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
    </svg>
);


const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
    </div>
);

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <label htmlFor="file-upload" className="cursor-pointer">
                <div className="relative border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg h-64 flex justify-center items-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-300 bg-slate-50 dark:bg-gray-700">
                    <div className="text-center">
                        <PhotoIcon />
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Cliquez ou déposez une image ici</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF jusqu'à 10 Mo</p>
                    </div>
                </div>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
        </div>
    );
};

interface PoemSelectorProps {
    value: PoemType;
    onChange: (value: PoemType) => void;
}

const PoemSelector: React.FC<PoemSelectorProps> = ({ value, onChange }) => (
    <div className='w-full'>
        <label htmlFor="poem-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Forme du poème
        </label>
        <div className="relative mt-1">
            <select
                id="poem-type"
                name="poem-type"
                value={value}
                onChange={(e) => onChange(e.target.value as PoemType)}
                className="block w-full appearance-none cursor-pointer rounded-lg bg-indigo-600 py-3 pl-4 pr-10 font-bold text-white shadow-md transition-colors duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                {POEM_TYPES.map(type => (
                    <option key={type.value} value={type.value} className="bg-white text-black dark:bg-gray-800 dark:text-slate-200 font-normal">{type.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
);


interface ContentDisplayProps {
    content: string | null;
    isLoading: boolean;
    error: string | null;
    contentType: 'poem' | 'quote' | 'title' | 'caption' | null;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, isLoading, error, contentType }) => {
    
    const contentTitles: { [key: string]: string } = {
        poem: 'Poème Inspiré',
        quote: 'Citations Pertinentes',
        title: 'Titre Suggéré',
        caption: 'Légende Proposée'
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center text-slate-600 dark:text-slate-400">
                    <Spinner />
                    <p className="mt-4 font-serif-display text-xl">L'IA compose votre création...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="text-center text-red-600 dark:text-red-400">
                    <h3 className="font-bold text-lg">Erreur</h3>
                    <p className="mt-2">{error}</p>
                </div>
            );
        }
        if (!content) {
            return (
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <p className="font-serif-display text-2xl">Votre création inspirée apparaîtra ici...</p>
                </div>
            );
        }
        
        const title = contentType ? contentTitles[contentType] : '';

        if (contentType === 'quote') {
            const quotesBlocks = content.split('---').filter(block => block.trim() !== '');
            return (
                <div className="w-full">
                    <h2 className="text-2xl font-bold font-serif-display text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
                    <div className="space-y-4 text-left">
                        {quotesBlocks.map((block, index) => {
                            const parts = block.trim().split('\n');
                            const text = parts[0].trim();
                            const author = parts.length > 1 ? parts[1].trim() : null;

                            return (
                                <blockquote key={index} className={`p-4 rounded-lg border-l-4 border-teal-500 dark:border-teal-400 transition-colors duration-300 ${index % 2 === 0 ? 'bg-slate-100 dark:bg-gray-700' : 'bg-slate-50 dark:bg-gray-700/50'}`}>
                                    <p className="italic text-lg text-slate-800 dark:text-slate-200">
                                        “{text}”
                                    </p>
                                    {author && (
                                        <footer className="mt-2 text-right text-slate-600 dark:text-slate-400 font-medium">
                                            {author}
                                        </footer>
                                    )}
                                </blockquote>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full text-center">
                 <h2 className="text-2xl font-bold font-serif-display text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap font-serif-display text-slate-800 dark:text-slate-200 text-xl">{content}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg h-full min-h-[400px] flex flex-col justify-center items-center">
            {renderContent()}
        </div>
    );
};


export default function App() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [poemType, setPoemType] = useState<PoemType>(PoemType.VERS_LIBRES);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [contentType, setContentType] = useState<'poem' | 'quote' | 'title' | 'caption' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeAction, setActiveAction] = useState<'poem' | 'quote' | 'title' | 'caption' | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleFileSelect = useCallback((file: File) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setGeneratedContent(null);
        setError(null);
        setContentType(null);
    }, []);
    
    const handleReset = () => {
        setImageFile(null);
        setImagePreview(null);
        setGeneratedContent(null);
        setError(null);
        setContentType(null);
        setIsLoading(false);
        setActiveAction(null);
    };


    const handleGeneratePoem = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('poem');
        setError(null);
        setGeneratedContent(null);
        setContentType('poem');

        try {
            const poem = await generatePoemFromImage(imageFile, poemType);
            setGeneratedContent(poem);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    const handleGenerateQuotes = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('quote');
        setError(null);
        setGeneratedContent(null);
        setContentType('quote');

        try {
            const quotes = await generateQuotesFromImage(imageFile);
            setGeneratedContent(quotes);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
             setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    const handleGenerateTitle = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('title');
        setError(null);
        setGeneratedContent(null);
        setContentType('title');

        try {
            const title = await generateTitleFromImage(imageFile);
            setGeneratedContent(title);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    const handleGenerateCaption = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('caption');
        setError(null);
        setGeneratedContent(null);
        setContentType('caption');

        try {
            const caption = await generateCaptionFromImage(imageFile);
            setGeneratedContent(caption);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto relative">
                 <button
                    onClick={toggleTheme}
                    className="absolute top-0 right-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                    aria-label="Changer de thème"
                >
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6 text-yellow-300" />}
                </button>
                <header className="text-center mb-10">
                   <div className="flex flex-col justify-center items-center gap-4">
                        <img src={logoBase64} alt="Logo AM" className="h-24 w-24" />
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white font-serif-display">Illustrer Votre Image</h1>
                            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Ajoutez un poème Ou une citation</p>
                        </div>
                   </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        {!imageFile ? (
                            <>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">1. Choisissez votre inspiration</h2>
                                <ImageUploader onFileSelect={handleFileSelect} />
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Votre Image</h2>
                                    <img src={imagePreview!} alt="Aperçu sélectionné" className="rounded-lg shadow-md w-full" />
                                </div>
                                
                                <div className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Créer un Poème</h2>
                                            <div className="flex-grow">
                                                <PoemSelector value={poemType} onChange={setPoemType} />
                                            </div>
                                            <button
                                                onClick={handleGeneratePoem}
                                                disabled={isLoading}
                                                className="w-full mt-4 flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <SparklesIcon />
                                                {isLoading && activeAction === 'poem' ? 'Génération...' : 'Générer le poème'}
                                            </button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col justify-between">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Trouver des Citations</h2>
                                            <button
                                                onClick={handleGenerateQuotes}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                            >
                                                <QuoteIcon />
                                                {isLoading && activeAction === 'quote' ? 'Recherche...' : 'Obtenir des citations'}
                                            </button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col justify-between">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Générer un titre</h2>
                                            <button
                                                onClick={handleGenerateTitle}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                            >
                                                <TitleIcon />
                                                {isLoading && activeAction === 'title' ? 'Génération...' : 'Obtenir un titre'}
                                            </button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col justify-between">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Générer une légende</h2>
                                            <button
                                                onClick={handleGenerateCaption}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center bg-rose-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-rose-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                            >
                                                <CaptionIcon />
                                                {isLoading && activeAction === 'caption' ? 'Génération...' : 'Obtenir une légende'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                 <div className="pt-4">
                                    <button
                                        onClick={handleReset}
                                        className="w-full flex items-center justify-center bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                    >
                                        Changer d'image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full">
                        <ContentDisplay content={generatedContent} isLoading={isLoading} error={error} contentType={contentType} />
                    </div>
                </main>
            </div>
        </div>
    );
}
