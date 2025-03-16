package ru.ilcorp.geometry_processing.v1.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SquareController {
    @GetMapping("/lab1")
    public String geometryProcessingSquare(Model model) {
        model.addAttribute("size", 100);
        return "square";
    }
}
