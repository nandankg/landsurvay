import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Widget to render text along a circular path
class CircularText extends StatelessWidget {
  final String text;
  final double radius;
  final double startAngle;
  final TextStyle? style;
  final bool isClockwise;

  const CircularText({
    super.key,
    required this.text,
    required this.radius,
    this.startAngle = 0,
    this.style,
    this.isClockwise = true,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(radius * 2, radius * 2),
      painter: _CircularTextPainter(
        text: text,
        radius: radius,
        startAngle: startAngle,
        style: style ?? const TextStyle(fontSize: 12, color: Colors.black),
        isClockwise: isClockwise,
      ),
    );
  }
}

class _CircularTextPainter extends CustomPainter {
  final String text;
  final double radius;
  final double startAngle;
  final TextStyle style;
  final bool isClockwise;

  _CircularTextPainter({
    required this.text,
    required this.radius,
    required this.startAngle,
    required this.style,
    required this.isClockwise,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    // Calculate the angle each character spans
    final textPainter = TextPainter(
      textDirection: TextDirection.ltr,
    );

    // Measure each character's width
    List<double> charWidths = [];
    for (int i = 0; i < text.length; i++) {
      textPainter.text = TextSpan(text: text[i], style: style);
      textPainter.layout();
      charWidths.add(textPainter.width);
    }

    // Total arc length needed
    double totalWidth = charWidths.reduce((a, b) => a + b);

    // Calculate angle per unit width
    double anglePerWidth = totalWidth / (radius * 0.85);

    // Start angle adjustment to center the text
    double currentAngle = startAngle - (anglePerWidth / 2);

    for (int i = 0; i < text.length; i++) {
      final char = text[i];
      textPainter.text = TextSpan(text: char, style: style);
      textPainter.layout();

      // Calculate angle for this character
      double charAngle = charWidths[i] / (radius * 0.85);
      currentAngle += charAngle / 2;

      // Calculate position
      double x, y, rotation;
      if (isClockwise) {
        x = center.dx + radius * math.cos(currentAngle - math.pi / 2);
        y = center.dy + radius * math.sin(currentAngle - math.pi / 2);
        rotation = currentAngle;
      } else {
        x = center.dx + radius * math.cos(-currentAngle + math.pi / 2);
        y = center.dy - radius * math.sin(-currentAngle + math.pi / 2);
        rotation = -currentAngle + math.pi;
      }

      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(rotation);

      textPainter.paint(
        canvas,
        Offset(-textPainter.width / 2, -textPainter.height / 2),
      );

      canvas.restore();

      currentAngle += charAngle / 2;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Widget showing circular emblem with curved text around it
class CircularEmblemWithText extends StatelessWidget {
  final Widget centerWidget;
  final String topText;
  final String bottomText;
  final double size;
  final Color textColor;
  final Color borderColor;
  final double borderWidth;

  const CircularEmblemWithText({
    super.key,
    required this.centerWidget,
    required this.topText,
    required this.bottomText,
    this.size = 200,
    this.textColor = Colors.black87,
    this.borderColor = Colors.black26,
    this.borderWidth = 1,
  });

  @override
  Widget build(BuildContext context) {
    final textStyle = TextStyle(
      fontSize: size * 0.05,
      fontWeight: FontWeight.w500,
      color: textColor,
      letterSpacing: 1.5,
    );

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Outer border circle
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: borderColor,
                width: borderWidth,
              ),
            ),
          ),

          // Top curved text
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SizedBox(
              height: size,
              child: CustomPaint(
                size: Size(size, size),
                painter: _ArcTextPainter(
                  text: topText,
                  radius: size / 2 - size * 0.08,
                  style: textStyle,
                  isTop: true,
                ),
              ),
            ),
          ),

          // Bottom curved text
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SizedBox(
              height: size,
              child: CustomPaint(
                size: Size(size, size),
                painter: _ArcTextPainter(
                  text: bottomText,
                  radius: size / 2 - size * 0.08,
                  style: textStyle,
                  isTop: false,
                ),
              ),
            ),
          ),

          // Center widget (logo)
          SizedBox(
            width: size * 0.55,
            height: size * 0.55,
            child: centerWidget,
          ),
        ],
      ),
    );
  }
}

class _ArcTextPainter extends CustomPainter {
  final String text;
  final double radius;
  final TextStyle style;
  final bool isTop;

  _ArcTextPainter({
    required this.text,
    required this.radius,
    required this.style,
    required this.isTop,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    final textPainter = TextPainter(
      textDirection: TextDirection.ltr,
    );

    // Measure total text width
    List<double> charWidths = [];
    for (int i = 0; i < text.length; i++) {
      textPainter.text = TextSpan(text: text[i], style: style);
      textPainter.layout();
      charWidths.add(textPainter.width);
    }

    double totalWidth = charWidths.reduce((a, b) => a + b);

    // Calculate total angle span for the text
    double totalAngle = totalWidth / radius;

    // Starting angle
    double startAngle;
    if (isTop) {
      // Top arc: start from left side going to right (clockwise from -90 degrees)
      startAngle = -math.pi / 2 - totalAngle / 2;
    } else {
      // Bottom arc: start from right side going to left (clockwise from 90 degrees)
      startAngle = math.pi / 2 + totalAngle / 2;
    }

    double currentAngle = startAngle;

    for (int i = 0; i < text.length; i++) {
      final char = text[i];
      textPainter.text = TextSpan(text: char, style: style);
      textPainter.layout();

      double charAngle = charWidths[i] / radius;

      if (isTop) {
        currentAngle += charAngle / 2;
      } else {
        currentAngle -= charAngle / 2;
      }

      // Calculate position on the arc
      double x = center.dx + radius * math.cos(currentAngle);
      double y = center.dy + radius * math.sin(currentAngle);

      canvas.save();
      canvas.translate(x, y);

      // Rotate text to follow the arc
      if (isTop) {
        canvas.rotate(currentAngle + math.pi / 2);
      } else {
        canvas.rotate(currentAngle - math.pi / 2);
      }

      textPainter.paint(
        canvas,
        Offset(-textPainter.width / 2, -textPainter.height / 2),
      );

      canvas.restore();

      if (isTop) {
        currentAngle += charAngle / 2;
      } else {
        currentAngle -= charAngle / 2;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
